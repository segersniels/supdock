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

var sshCmd = &cobra.Command{
	Use:   "ssh",
	Short: "SSH into a container",
	Long:  "Interactive SSH into a running container with shell selection",
	Run: func(cmd *cobra.Command, args []string) {
		runSSH()
	},
}

func runSSH() {
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

	// Prompt for shell selection
	shell, err := prompter.PromptShellSelection()
	if err != nil {
		fmt.Println(style.CreateErrorMessage(fmt.Sprintf("Shell selection failed: %v", err)))
		os.Exit(1)
	}

	// Execute docker exec command
	exec.RunDockerCommandAndExit("exec", "-ti", containerID, shell)
}

func init() {
	rootCmd.AddCommand(sshCmd)
}
