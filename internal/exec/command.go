package exec

import (
	"fmt"
	"os"
	"os/exec"
	"strings"

	supLog "github.com/segersniels/supdock/internal/log"
)

// RunDockerCommand executes a docker command with the given arguments
func RunDockerCommand(args ...string) error {
	supLog.Debug("executing docker command:", strings.Join(args, " "))

	cmd := exec.Command("docker", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	return cmd.Run()
}

// RunDockerCommandAndExit executes a docker command and exits with the same exit code
func RunDockerCommandAndExit(args ...string) {
	supLog.Debug("exec: docker", strings.Join(args, " "))

	cmd := exec.Command("docker", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	err := cmd.Run()
	if err != nil {
		if exitError, ok := err.(*exec.ExitError); ok {
			os.Exit(exitError.ExitCode())
		}
		fmt.Fprintf(os.Stderr, "Error executing docker command: %v\n", err)
		os.Exit(1)
	}
	os.Exit(0)
}

// RunDockerCommandWithOutput executes a docker command and captures its output
func RunDockerCommandWithOutput(args ...string) ([]byte, error) {
	supLog.Debug("exec: docker", strings.Join(args, " "))

	cmd := exec.Command("docker", args...)
	return cmd.CombinedOutput()
}

// RunDockerCommandInBackground executes a docker command in the background
func RunDockerCommandInBackground(args ...string) error {
	supLog.Debug("Executing in background: docker", strings.Join(args, " "))

	cmd := exec.Command("docker", args...)
	cmd.Stdout = nil
	cmd.Stderr = nil
	cmd.Stdin = nil

	return cmd.Start()
}

// RunDockerCommandInBackgroundWithError executes a docker command in the background and waits for completion
func RunDockerCommandInBackgroundWithError(args ...string) error {
	supLog.Debug("Executing in background: docker", strings.Join(args, " "))

	cmd := exec.Command("docker", args...)
	cmd.Stdout = nil
	cmd.Stderr = nil
	cmd.Stdin = nil

	return cmd.Run()
}

// ReplaceArg replaces all occurrences of target with value in the args slice
func ReplaceArg(args []string, target, value string) []string {
	result := make([]string, len(args))
	for i, arg := range args {
		result[i] = strings.ReplaceAll(arg, target, value)
	}
	return result
}
