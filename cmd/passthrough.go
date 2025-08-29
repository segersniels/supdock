package cmd

import (
	"fmt"
	"os"
	"os/exec"
)

// handlePassthrough passes unknown commands directly to docker
func handlePassthrough(args []string) {
	// Find docker binary
	dockerPath, err := exec.LookPath("docker")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: Could not find docker binary: %v\n", err)
		os.Exit(1)
	}

	// Execute docker command with the provided arguments
	cmd := exec.Command(dockerPath, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	if err := cmd.Run(); err != nil {
		if exitError, ok := err.(*exec.ExitError); ok {
			os.Exit(exitError.ExitCode())
		}
		fmt.Fprintf(os.Stderr, "Error executing docker command: %v\n", err)
		os.Exit(1)
	}
}
