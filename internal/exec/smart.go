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

// ResourceKind identifies the Docker resource selected for a command.
type ResourceKind string

const (
	ContainerResource ResourceKind = "container"
	ImageResource     ResourceKind = "image"
	AnyResource       ResourceKind = "container or image"
)

const (
	CmdStart   SupportedCommand = "start"
	CmdRestart SupportedCommand = "restart"
	CmdStop    SupportedCommand = "stop"
	CmdRemove  SupportedCommand = "rm"
	CmdRmi     SupportedCommand = "rmi"
	CmdLogs    SupportedCommand = "logs"
	CmdHistory SupportedCommand = "history"
	CmdInspect SupportedCommand = "inspect"
	CmdDebug   SupportedCommand = "debug"
)

var (
	missingResourceRegex = regexp.MustCompile(`(?i)no such (?:container|image|object):\s*([^\s\n]+)`)
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
	"debug":   CmdDebug,
}

// ResourceKindForCommand reports whether a command operates on containers or images.
func ResourceKindForCommand(command string) ResourceKind {
	switch SupportedCommand(command) {
	case CmdRmi, CmdHistory:
		return ImageResource
	case CmdDebug:
		return AnyResource
	default:
		return ContainerResource
	}
}

// IsMissingArgumentError reports whether Docker rejected a command without its target resource.
func IsMissingArgumentError(message string) bool {
	return strings.Contains(message, "requires exactly 1 argument") ||
		strings.Contains(message, "requires at least 1 argument") ||
		strings.Contains(message, "requires 1 argument") ||
		strings.Contains(message, "image or container required")
}

// CreateContextWithTimeout returns a Docker operation context that also handles termination signals.
func CreateContextWithTimeout() (context.Context, context.CancelFunc) {
	signalCtx, stopSignals := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	ctx, cancelTimeout := context.WithTimeout(signalCtx, constants.DockerOperationTimeout)

	return ctx, func() {
		cancelTimeout()
		stopSignals()
	}
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

	if render.ShouldIntercept(args) {
		supLog.Debug("using enhanced rendering for:", args[0])
		if err := render.InterceptDockerCommand(args); err != nil {
			supLog.Debug("enhanced rendering failed, falling back to docker:", err)
			fmt.Fprintf(os.Stderr, "Render error: %v\n", err)
			// Fallback to normal Docker command
			RunDockerCommandAndExit(render.StripSupdockRenderFlags(args)...)
		}
		return
	}

	command := args[0]
	supportedCmd, isSupported := supportedCommands[command]

	if !isSupported {
		supLog.Debug("direct docker passthrough for:", command)
		RunDockerCommandAndExit(args...)
		return
	}

	supLog.Debug("attempting smart error handling for:", command)
	output, err := RunDockerCommandWithOutput(args...)
	if err == nil {
		if len(output) > 0 {
			_, _ = os.Stderr.Write(output)
		}
		os.Exit(0)
	}

	errorMsg := string(output)

	if query, ok := MissingResourceFromError(errorMsg); ok {
		supLog.Debug("resource not found, attempting fuzzy search resolution")
		handleNoSuchResourceError(args, query, supportedCmd)
		return
	}

	if IsMissingArgumentError(errorMsg) {
		supLog.Debug("missing argument, prompting for interactive selection")
		handleMissingArgumentError(args, supportedCmd)
		return
	}

	supLog.Debug("error not handled by smart features, showing original docker error")
	fmt.Fprintf(os.Stderr, "%s", errorMsg)
	if exitError, ok := err.(*exec.ExitError); ok {
		os.Exit(exitError.ExitCode())
	}
	os.Exit(1)
}

func handleNoSuchResourceError(args []string, query string, cmd SupportedCommand) {
	if query == "all" {
		handleParallelExecution(args, cmd)
		return
	}

	var selectedID string
	var err error
	if ResourceKindForCommand(string(cmd)) == ImageResource {
		selectedID, err = performFuzzyImageSearch(query)
	} else {
		selectedID, err = performFuzzyContainerSearch(query, getContainerTypeForCommand(cmd))
	}
	if err != nil {
		if prompt.IsCancelled(err) {
			return
		}
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	newArgs := ReplaceArg(args, query, selectedID)
	RunDockerCommandAndExit(newArgs...)
}

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

	switch ResourceKindForCommand(string(cmd)) {
	case ImageResource:
		selectedID, err = prompter.PromptImageSelection(ctx, "Select an image from the list")
	case AnyResource:
		selectedID, err = prompter.PromptResourceSelection(ctx, "Select a container or image from the list")
	default:
		selectedID, err = prompter.PromptContainerSelection(ctx, "Select a container from the list", containerType)
	}

	if err != nil {
		if prompt.IsCancelled(err) {
			return
		}
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	newArgs := append(args, selectedID)
	RunDockerCommandAndExit(newArgs...)
}

func performFuzzyContainerSearch(query string, containerType docker.ContainerType) (string, error) {
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

	formattedContainers := make([]string, len(containers))
	for i, container := range containers {
		formattedContainers[i] = fmt.Sprintf("%s - %s (%s)",
			container.ID, container.Name, container.Image)
	}

	return selectFuzzyResult(query, formattedContainers,
		func() (string, error) {
			return prompter.PromptContainerSelection(ctx, "No matches found. Select a container from the list", containerType)
		},
		func(results []string) (string, error) {
			return prompter.PromptFromChoices("Multiple matches found. Select a container:", results)
		},
	)
}

func performFuzzyImageSearch(query string) (string, error) {
	prompter, err := prompt.NewPrompter()
	if err != nil {
		return "", err
	}
	defer prompter.Close()

	ctx, cancel := CreateContextWithTimeout()
	defer cancel()

	images, err := prompter.ListImages(ctx)
	if err != nil {
		return "", err
	}
	if len(images) == 0 {
		return "", fmt.Errorf("no images found")
	}

	choices := make([]string, len(images))
	for i, image := range images {
		choices[i] = fmt.Sprintf("%s - %s", image.ID, image.Name)
	}

	return selectFuzzyResult(query, choices,
		func() (string, error) {
			return prompter.PromptImageSelection(ctx, "No matches found. Select an image from the list")
		},
		func(results []string) (string, error) {
			return prompter.PromptFromChoices("Multiple matches found. Select an image:", results)
		},
	)
}

func selectFuzzyResult(
	query string,
	choices []string,
	selectFallback func() (string, error),
	selectMultiple func([]string) (string, error),
) (string, error) {
	results := search.FuzzySearch(choices, query, constants.DefaultFuzzyThreshold)
	switch len(results) {
	case 0:
		return selectFallback()
	case 1:
		return extractIDFromResult(results[0]), nil
	default:
		return selectMultiple(results)
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

// MissingResourceFromError extracts a missing container or image name from Docker output.
func MissingResourceFromError(errorMsg string) (string, bool) {
	matches := missingResourceRegex.FindStringSubmatch(errorMsg)
	if len(matches) < 2 {
		return "", false
	}

	resource := strings.Trim(strings.TrimSpace(matches[1]), `"'`)
	return resource, resource != ""
}

// extractIDFromResult extracts container ID from formatted result
func extractIDFromResult(result string) string {
	parts := strings.Split(result, " - ")
	if len(parts) > 0 {
		return strings.TrimSpace(parts[0])
	}
	return result
}
