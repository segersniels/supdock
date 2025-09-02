package render

import (
	"encoding/json"
	"fmt"
	"os/exec"
	"strings"
)

// DockerContainer represents a container from docker ps --format json output
type DockerContainer struct {
	ID         string `json:"ID"`
	Names      string `json:"Names"`
	Image      string `json:"Image"`
	Command    string `json:"Command"`
	CreatedAt  string `json:"CreatedAt"`
	State      string `json:"State"`
	Status     string `json:"Status"`
	Ports      string `json:"Ports"`
	Labels     string `json:"Labels"`
	Size       string `json:"Size"`
	RunningFor string `json:"RunningFor"`
}

// DockerImage represents an image from docker images --format json output
type DockerImage struct {
	ID           string `json:"ID"`
	Repository   string `json:"Repository"`
	Tag          string `json:"Tag"`
	CreatedAt    string `json:"CreatedAt"`
	Size         string `json:"Size"`
	CreatedSince string `json:"CreatedSince"`
}

// ShouldIntercept checks if we should intercept this Docker command
func ShouldIntercept(args []string) bool {
	if len(args) == 0 {
		return false
	}

	// Don't intercept if help flags or custom formatting flags are present
	for _, arg := range args {
		if arg == "--help" || arg == "-h" {
			return false
		}
		// Don't intercept if user is using custom format flags
		if arg == "--format" || arg == "-f" {
			return false
		}
		// Don't intercept format flags with values like --format=json
		if strings.HasPrefix(arg, "--format=") {
			return false
		}
		// Don't intercept other formatting flags that conflict with our JSON parsing
		if arg == "--no-trunc" || arg == "--quiet" || arg == "-q" {
			return false
		}
		// Check for other flags that change output format
		if arg == "--size" || arg == "-s" {
			return false
		}
	}

	// Check for docker ps variations
	if args[0] == "ps" {
		return true
	}

	// Check for docker images
	if args[0] == "images" {
		return true
	}

	return false
}

// InterceptDockerCommand intercepts and renders Docker commands with custom styling
func InterceptDockerCommand(args []string) error {
	if len(args) == 0 {
		return fmt.Errorf("no command provided")
	}

	switch args[0] {
	case "ps":
		return renderContainers(args)
	case "images":
		return renderImages(args)
	default:
		return fmt.Errorf("command not supported for interception: %s", args[0])
	}
}

// renderContainers renders docker ps output with custom styling
func renderContainers(args []string) error {
	// Build docker command with JSON format
	dockerArgs := []string{"ps", "--format", "json"}

	// Pass through additional flags
	for i := 1; i < len(args); i++ {
		dockerArgs = append(dockerArgs, args[i])
	}

	cmd := exec.Command("docker", dockerArgs...)
	output, err := cmd.Output()
	if err != nil {
		return fmt.Errorf("docker command failed: %w", err)
	}

	// Parse JSON output
	var containers []DockerContainer
	lines := strings.Split(strings.TrimSpace(string(output)), "\n")

	for _, line := range lines {
		if line == "" {
			continue
		}

		var container DockerContainer
		if err := json.Unmarshal([]byte(line), &container); err != nil {
			continue // Skip malformed lines
		}
		containers = append(containers, container)
	}

	if len(containers) == 0 {
		fmt.Println("No containers found")
		return nil
	}

	// Prepare table data
	headers := []string{"CONTAINER ID", "NAMES", "IMAGE", "COMMAND", "CREATED", "STATUS", "PORTS"}
	var rows [][]string

	for _, container := range containers {
		// Format container data for table
		id := container.ID
		if len(id) > 12 {
			id = id[:12] // Short ID
		}

		// Truncate command if too long
		command := container.Command
		if len(command) > 25 {
			command = command[:22] + "…"
		}

		// Truncate ports if too long
		ports := container.Ports
		if len(ports) > 30 {
			ports = ports[:27] + "…"
		}

		row := []string{
			id,
			container.Names,
			container.Image,
			command,
			container.RunningFor,
			container.Status,
			ports,
		}
		rows = append(rows, row)
	}

	fmt.Print(CreateDockerTable(headers, rows))
	return nil
}

// renderImages renders docker images output with custom table styling
func renderImages(args []string) error {
	// Build docker command with JSON format
	dockerArgs := []string{"images", "--format", "json"}

	// Pass through additional flags (skip the first 'images' arg)
	for i := 1; i < len(args); i++ {
		dockerArgs = append(dockerArgs, args[i])
	}

	cmd := exec.Command("docker", dockerArgs...)
	output, err := cmd.Output()
	if err != nil {
		return fmt.Errorf("docker command failed: %w", err)
	}

	// Parse JSON output
	var images []DockerImage
	lines := strings.Split(strings.TrimSpace(string(output)), "\n")

	for _, line := range lines {
		if line == "" {
			continue
		}

		var image DockerImage
		if err := json.Unmarshal([]byte(line), &image); err != nil {
			continue // Skip malformed lines
		}
		images = append(images, image)
	}

	if len(images) == 0 {
		fmt.Println("No images found")
		return nil
	}

	// Prepare table data
	headers := []string{"IMAGE ID", "REPOSITORY", "TAG", "CREATED", "SIZE"}
	rows := make([][]string, len(images))

	for i, image := range images {
		// Format image data for table
		id := image.ID
		if len(id) > 12 {
			id = id[:12] // Short ID
		}

		repository := image.Repository
		tag := image.Tag
		if tag == "" {
			tag = "<none>"
		}

		rows[i] = []string{
			id,
			repository,
			tag,
			image.CreatedSince,
			image.Size,
		}
	}

	fmt.Print(CreateDockerTable(headers, rows))
	return nil
}

// truncateString truncates a string to maxLen with ellipsis
func truncateString(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen-3] + "..."
}
