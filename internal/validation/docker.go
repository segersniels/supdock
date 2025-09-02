package validation

import (
	"fmt"
	"regexp"
	"strings"
)

// Valid Docker command arguments that we consider safe
var safeDockerCommands = map[string]bool{
	"start":    true,
	"stop":     true,
	"restart":  true,
	"rm":       true,
	"rmi":      true,
	"logs":     true,
	"inspect":  true,
	"history":  true,
	"ps":       true,
	"images":   true,
	"exec":     true,
	"pull":     true,
	"push":     true,
	"build":    true,
	"run":      true,
	"create":   true,
}

// Potentially dangerous flags that could be used maliciously
var dangerousFlags = []string{
	"--privileged",
	"--cap-add",
	"--device",
	"--volume=/:",
	"--volume=/etc",
	"--volume=/var/run/docker.sock",
	"--net=host",
	"--pid=host",
	"--ipc=host",
	"--user=root",
}

// Container/image name validation regex
var (
	containerNameRegex = regexp.MustCompile(`^[a-zA-Z0-9][a-zA-Z0-9_.-]*$`)
	imageNameRegex     = regexp.MustCompile(`^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:/[a-z0-9]+(?:[._-][a-z0-9]+)*)*(?::[a-zA-Z0-9_.-]+)?$`)
)

// ValidateDockerArgs validates Docker command arguments for safety
func ValidateDockerArgs(args []string) error {
	if len(args) == 0 {
		return fmt.Errorf("no arguments provided")
	}

	command := args[0]
	if !safeDockerCommands[command] {
		return fmt.Errorf("command '%s' is not in the allowed list", command)
	}

	// Check for dangerous flags
	for _, arg := range args {
		for _, dangerous := range dangerousFlags {
			if strings.Contains(strings.ToLower(arg), strings.ToLower(dangerous)) {
				return fmt.Errorf("potentially dangerous flag detected: %s", arg)
			}
		}
	}

	return nil
}

// ValidateContainerName validates a container name
func ValidateContainerName(name string) error {
	if name == "" {
		return fmt.Errorf("container name cannot be empty")
	}

	if len(name) > 253 {
		return fmt.Errorf("container name too long (max 253 characters)")
	}

	if !containerNameRegex.MatchString(name) {
		return fmt.Errorf("invalid container name format: %s", name)
	}

	return nil
}

// ValidateImageName validates an image name
func ValidateImageName(name string) error {
	if name == "" {
		return fmt.Errorf("image name cannot be empty")
	}

	if len(name) > 255 {
		return fmt.Errorf("image name too long (max 255 characters)")
	}

	if !imageNameRegex.MatchString(name) {
		return fmt.Errorf("invalid image name format: %s", name)
	}

	return nil
}

// SanitizeInput removes potentially dangerous characters from user input
func SanitizeInput(input string) string {
	// Remove control characters and common injection patterns
	input = strings.ReplaceAll(input, "\n", "")
	input = strings.ReplaceAll(input, "\r", "")
	input = strings.ReplaceAll(input, "\t", "")
	input = strings.ReplaceAll(input, ";", "")
	input = strings.ReplaceAll(input, "&", "")
	input = strings.ReplaceAll(input, "|", "")
	input = strings.ReplaceAll(input, "`", "")
	input = strings.ReplaceAll(input, "$", "")

	return strings.TrimSpace(input)
}