package cmd

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/segersniels/supdock/internal/docker"
	"github.com/segersniels/supdock/internal/exec"
	"github.com/segersniels/supdock/internal/prompt"
	"github.com/segersniels/supdock/internal/search"
	"github.com/spf13/cobra"
)

var envCmd = &cobra.Command{
	Use:   "env [QUERY]",
	Short: "See the environment variables of a running container",
	Long:  "Display environment variables of a running container with optional fuzzy search",
	Args:  cobra.MaximumNArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		var query string
		if len(args) > 0 {
			query = args[0]
		}
		runEnv(query)
	},
}

func runEnv(query string) {
	prompter, err := prompt.NewPrompter()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
	defer prompter.Close()

	ctx, cancel := exec.CreateContextWithTimeout()
	defer cancel()
	var containerID string

	if query != "" {
		// Handle fuzzy search for the container
		containerID, err = handleFuzzySearch(ctx, prompter, query, docker.RunningContainers)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
	} else {
		// Prompt for container selection
		containerID, err = prompter.PromptContainerSelection(ctx, "Select a container from the list", docker.RunningContainers)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
	}

	// Execute docker exec env command
	exec.RunDockerCommandAndExit("exec", "-ti", containerID, "env")
}

// handleFuzzySearch performs fuzzy search and returns the selected container ID
func handleFuzzySearch(ctx context.Context, prompter *prompt.Prompter, query string, containerType docker.ContainerType) (string, error) {
	// Get all containers
	containers, err := prompter.ListContainers(ctx, containerType)
	if err != nil {
		return "", fmt.Errorf("failed to list containers: %w", err)
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
	results := search.FuzzySearch(formattedContainers, query, 0.7)

	switch len(results) {
	case 0:
		// No results found, prompt user to select from all containers
		return prompter.PromptContainerSelection(ctx, "No matches found. Select a container from the list", containerType)
	case 1:
		// Single result, extract and return ID
		return extractIDFromResult(results[0]), nil
	default:
		// Multiple results, prompt user to choose
		return prompter.PromptFromChoices("Multiple matches found. Select a container:", results)
	}
}

// extractIDFromResult extracts container ID from formatted result
func extractIDFromResult(result string) string {
	// Extract ID from format: "8ee008c67aed - foo (nginx:1.19)"
	parts := strings.Split(result, " - ")
	if len(parts) > 0 {
		return strings.TrimSpace(parts[0])
	}
	return result
}

func init() {
	rootCmd.AddCommand(envCmd)
}
