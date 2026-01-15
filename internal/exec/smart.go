package exec

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"regexp"
	"strings"
	"sync"
	"syscall"

	"github.com/segersniels/supdock/internal/constants"
	"github.com/segersniels/supdock/internal/docker"
	supLog "github.com/segersniels/supdock/internal/log"
	"github.com/segersniels/supdock/internal/prompt"
	"github.com/segersniels/supdock/internal/render"
	"github.com/segersniels/supdock/internal/search"
)

// SupportedCommand represents commands that supdock can handle intelligently
type SupportedCommand string

const (
	CmdStart   SupportedCommand = "start"
	CmdRestart SupportedCommand = "restart"
	CmdStop    SupportedCommand = "stop"
	CmdRemove  SupportedCommand = "rm"
	CmdRmi     SupportedCommand = "rmi"
	CmdLogs    SupportedCommand = "logs"
	CmdHistory SupportedCommand = "history"
	CmdInspect SupportedCommand = "inspect"
)

// Import constants from centralized location

// Pre-compiled regex patterns for error parsing
var (
	noSuchContainerRegex = regexp.MustCompile(`No such container:\s*([^\s\n]+)`)
	noSuchImageRegex     = regexp.MustCompile(`No such image:\s*([^\s\n]+)`)
	generalErrorRegex    = regexp.MustCompile(`Error.*:\s*([^\s\n]+)$`)
)

var supportedCommands = map[string]SupportedCommand{
	"start":   CmdStart,
	"restart": CmdRestart,
	"stop":    CmdStop,
	"rm":      CmdRemove,
	"rmi":     CmdRmi,
	"logs":    CmdLogs,
	"history": CmdHistory,
	"inspect": CmdInspect,
}

// CreateContextWithTimeout creates a context with timeout and signal handling
func CreateContextWithTimeout() (context.Context, context.CancelFunc) {
	ctx, cancel := context.WithTimeout(context.Background(), constants.DockerOperationTimeout)

	// Handle interrupts gracefully
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	go func() {
		select {
		case <-c:
			cancel()
		case <-ctx.Done():
		}
	}()

	return ctx, cancel
}

// getContainerTypeForCommand returns the appropriate container type for a command
func getContainerTypeForCommand(cmd SupportedCommand) docker.ContainerType {
	switch cmd {
	case CmdStart, CmdRemove:
		return docker.StoppedContainers
	case CmdRestart, CmdStop:
		return docker.RunningContainers
	case CmdLogs, CmdInspect:
		return docker.AllContainers
	default:
		return docker.RunningContainers
	}
}

// SmartPassthrough executes docker commands with intelligent error handling
func SmartPassthrough(args []string) {
	supLog.Debug("entering smart passthrough with args:", args)

	if len(args) == 0 {
		supLog.Debug("no args provided, executing empty docker command")
		RunDockerCommandAndExit(args...)
		return
	}

	// Check if we should intercept for beautiful rendering
	if render.ShouldIntercept(args) {
		supLog.Debug("using enhanced rendering for:", args[0])
		if err := render.InterceptDockerCommand(args); err != nil {
			supLog.Debug("enhanced rendering failed, falling back to docker:", err)
			fmt.Fprintf(os.Stderr, "Render error: %v\n", err)
			// Fallback to normal Docker command
			RunDockerCommandAndExit(args...)
		}
		return
	}

	command := args[0]
	supportedCmd, isSupported := supportedCommands[command]

	// If not a supported command, just pass through
	if !isSupported {
		supLog.Debug("direct docker passthrough for:", command)
		RunDockerCommandAndExit(args...)
		return
	}

	supLog.Debug("attempting smart error handling for:", command)
	// Try to execute the command first
	output, err := RunDockerCommandWithOutput(args...)
	if err == nil {
		// Command succeeded, we're done
		os.Exit(0)
		return
	}

	// Command failed, analyze the error
	errorMsg := string(output)

	// Handle "No such container" or "No such image" errors
	if strings.Contains(errorMsg, "No such container") || strings.Contains(errorMsg, "No such image") {
		supLog.Debug("resource not found, attempting fuzzy search resolution")
		handleNoSuchResourceError(args, errorMsg, supportedCmd)
		return
	}

	// Handle "requires exactly 1 argument" or "requires at least 1 argument" errors
	if strings.Contains(errorMsg, "requires exactly 1 argument") ||
		strings.Contains(errorMsg, "requires at least 1 argument") ||
		strings.Contains(errorMsg, "requires 1 argument") {
		supLog.Debug("missing argument, prompting for interactive selection")
		handleMissingArgumentError(args, supportedCmd)
		return
	}

	// For other errors, just display them and exit
	supLog.Debug("error not handled by smart features, showing original docker error")
	fmt.Fprintf(os.Stderr, "%s", errorMsg)
	if exitError, ok := err.(*exec.ExitError); ok {
		os.Exit(exitError.ExitCode())
	}
	os.Exit(1)
}

// handleNoSuchResourceError handles cases where container/image doesn't exist
func handleNoSuchResourceError(args []string, errorMsg string, cmd SupportedCommand) {
	// Extract the resource name from the error message
	query := extractResourceNameFromError(errorMsg)
	if query == "" {
		fmt.Fprintf(os.Stderr, "%s", errorMsg)
		os.Exit(1)
		return
	}

	// Special case for "all" - perform parallel execution
	if query == "all" {
		handleParallelExecution(args, cmd)
		return
	}

	// Perform fuzzy search
	containerType := getContainerTypeForCommand(cmd)
	selectedID, err := performFuzzySearch(query, containerType)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	// Replace the query with the selected ID and execute
	newArgs := ReplaceArg(args, query, selectedID)
	RunDockerCommandAndExit(newArgs...)
}

// handleMissingArgumentError handles cases where no resource is specified
func handleMissingArgumentError(args []string, cmd SupportedCommand) {
	containerType := getContainerTypeForCommand(cmd)

	prompter, err := prompt.NewPrompter()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
	defer prompter.Close()

	ctx, cancel := CreateContextWithTimeout()
	defer cancel()

	var selectedID string

	if cmd == CmdRmi || cmd == CmdHistory {
		// For image commands
		selectedID, err = prompter.PromptImageSelection(ctx, "Select an image from the list")
	} else {
		// For container commands
		selectedID, err = prompter.PromptContainerSelection(ctx, "Select a container from the list", containerType)
	}

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	// Append the selected ID and execute
	newArgs := append(args, selectedID)
	RunDockerCommandAndExit(newArgs...)
}

// performFuzzySearch performs fuzzy search and returns selected container ID
func performFuzzySearch(query string, containerType docker.ContainerType) (string, error) {
	prompter, err := prompt.NewPrompter()
	if err != nil {
		return "", err
	}
	defer prompter.Close()

	ctx, cancel := CreateContextWithTimeout()
	defer cancel()

	containers, err := prompter.ListContainers(ctx, containerType)
	if err != nil {
		return "", err
	}

	if len(containers) == 0 {
		return "", fmt.Errorf("no containers found")
	}

	// Format containers for search
	formattedContainers := make([]string, len(containers))
	for i, container := range containers {
		formattedContainers[i] = fmt.Sprintf("%s - %s (%s)",
			container.ID, container.Name, container.Image)
	}

	// Perform fuzzy search
	results := search.FuzzySearch(formattedContainers, query, constants.DefaultFuzzyThreshold)

	switch len(results) {
	case 0:
		// No results found, prompt user to select
		return prompter.PromptContainerSelection(ctx, "No matches found. Select a container from the list", containerType)
	case 1:
		// Single result
		return extractIDFromResult(results[0]), nil
	default:
		// Multiple results
		return prompter.PromptFromChoices("Multiple matches found. Select a container:", results)
	}
}

// handleParallelExecution performs parallel execution on all containers
func handleParallelExecution(args []string, cmd SupportedCommand) {
	// Only support parallel execution for these commands
	if cmd != CmdStart && cmd != CmdStop && cmd != CmdRestart {
		fmt.Fprintf(os.Stderr, "Parallel execution is not supported for this command\n")
		os.Exit(1)
	}

	containerType := getContainerTypeForCommand(cmd)
	prompter, err := prompt.NewPrompter()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
	defer prompter.Close()

	ctx, cancel := CreateContextWithTimeout()
	defer cancel()

	containers, err := prompter.ListContainers(ctx, containerType)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	if len(containers) == 0 {
		fmt.Fprintf(os.Stderr, "No containers found\n")
		os.Exit(1)
	}

	fmt.Println("Asynchronous execution of command is happening in the background")

	var wg sync.WaitGroup
	errorChan := make(chan error, len(containers))

	for _, container := range containers {
		wg.Add(1)
		go func(containerID string) {
			defer wg.Done()

			newArgs := ReplaceArg(args, "all", containerID)
			if err := RunDockerCommandInBackgroundWithError(newArgs...); err != nil {
				errorChan <- fmt.Errorf("container %s: %w", containerID, err)
			}
		}(container.ID)
	}

	wg.Wait()
	close(errorChan)

	// Collect any errors
	var errors []error
	for err := range errorChan {
		errors = append(errors, err)
	}

	if len(errors) > 0 {
		fmt.Fprintf(os.Stderr, "Some operations failed:\n")
		for _, err := range errors {
			fmt.Fprintf(os.Stderr, "  %v\n", err)
		}
		os.Exit(1)
	}

	fmt.Printf("Some containers might take longer than others to %s\n", string(cmd))
	os.Exit(0)
}

// extractResourceNameFromError extracts resource name from Docker error message
func extractResourceNameFromError(errorMsg string) string {
	// Try precompiled regex patterns
	regexPatterns := []*regexp.Regexp{
		noSuchContainerRegex,
		noSuchImageRegex,
		generalErrorRegex,
	}

	for _, re := range regexPatterns {
		matches := re.FindStringSubmatch(errorMsg)
		if len(matches) > 1 {
			return strings.TrimSpace(matches[1])
		}
	}

	// Fallback: extract the last word from the last line
	lines := strings.Split(strings.TrimSpace(errorMsg), "\n")
	if len(lines) > 0 {
		lastLine := lines[len(lines)-1]
		words := strings.Fields(lastLine)
		if len(words) > 0 {
			return strings.TrimSpace(words[len(words)-1])
		}
	}

	return ""
}

// extractIDFromResult extracts container ID from formatted result
func extractIDFromResult(result string) string {
	parts := strings.Split(result, " - ")
	if len(parts) > 0 {
		return strings.TrimSpace(parts[0])
	}
	return result
}
