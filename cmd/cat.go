package cmd

import (
	"fmt"
	"os"

	"github.com/segersniels/supdock/internal/docker"
	"github.com/segersniels/supdock/internal/exec"
	"github.com/segersniels/supdock/internal/prompt"
	"github.com/segersniels/supdock/pkg/style"
	"github.com/spf13/cobra"
)

var catCmd = &cobra.Command{
	Use:   "cat",
	Short: "Echo the contents of a file using cat on a container",
	Long:  "View file contents within a running container using cat",
	Run: func(cmd *cobra.Command, args []string) {
		runCat()
	},
}

func runCat() {
	prompter, err := prompt.NewPrompter()
	if err != nil {
		fmt.Println(style.CreateErrorMessage(fmt.Sprintf("Failed to initialize: %v", err)))
		os.Exit(1)
	}
	defer prompter.Close()

	ctx, cancel := exec.CreateContextWithTimeout()
	defer cancel()

	// Prompt for container selection
	containerID, err := prompter.PromptContainerSelection(ctx, "Select container:", docker.RunningContainers)
	if err != nil {
		fmt.Println(style.CreateErrorMessage(fmt.Sprintf("Selection failed: %v", err)))
		os.Exit(1)
	}

	// Prompt for file path
	filePath, err := prompter.PromptText("File path:")
	if err != nil {
		fmt.Println(style.CreateErrorMessage(fmt.Sprintf("Input failed: %v", err)))
		os.Exit(1)
	}

	// Execute docker exec cat command
	exec.RunDockerCommandAndExit("exec", "-ti", containerID, "cat", filePath)
}

func init() {
	rootCmd.AddCommand(catCmd)
}
