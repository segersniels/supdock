package exec

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"strings"

	supLog "github.com/segersniels/supdock/internal/log"
)

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

// RunDockerCommandWithOutput streams stdout and captures stderr for error handling.
func RunDockerCommandWithOutput(args ...string) ([]byte, error) {
	supLog.Debug("exec: docker", strings.Join(args, " "))

	cmd := exec.Command("docker", args...)
	cmd.Stdin = os.Stdin

	var output bytes.Buffer
	cmd.Stdout = os.Stdout
	cmd.Stderr = &output

	err := cmd.Run()

	return output.Bytes(), err
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

// ReplaceArg replaces arguments that exactly match target.
func ReplaceArg(args []string, target, value string) []string {
	result := make([]string, len(args))
	for i, arg := range args {
		if arg == target {
			result[i] = value
			continue
		}
		result[i] = arg
	}
	return result
}
