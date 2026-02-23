package render

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"

	"github.com/charmbracelet/x/ansi"
	"golang.org/x/term"
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

const (
	allColumnsFlag      = "--all-columns"
	allColumnsAliasFlag = "--all-cols"
)

type renderOptions struct {
	showAllColumns bool
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

	cleanArgs, options := parseRenderOptions(args)
	if len(cleanArgs) == 0 {
		return fmt.Errorf("no command provided")
	}

	switch cleanArgs[0] {
	case "ps":
		return renderContainers(cleanArgs, options)
	case "images":
		return renderImages(cleanArgs)
	default:
		return fmt.Errorf("command not supported for interception: %s", cleanArgs[0])
	}
}

// renderContainers renders docker ps output with custom styling
func renderContainers(args []string, options renderOptions) error {
	terminalWidth := getTerminalWidth()

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
	columns := getContainerColumns(terminalWidth, options.showAllColumns)
	headers := columns.visible
	var rows [][]string

	for _, container := range containers {
		// Format container data for table
		id := container.ID
		if len(id) > 12 {
			id = id[:12] // Short ID
		}

		row := []string{}
		for _, header := range headers {
			switch header {
			case "CONTAINER ID":
				row = append(row, id)
			case "NAMES":
				row = append(row, container.Names)
			case "IMAGE":
				row = append(row, container.Image)
			case "COMMAND":
				row = append(row, truncateDisplayWidth(container.Command, 25))
			case "CREATED":
				row = append(row, container.RunningFor)
			case "STATUS":
				row = append(row, container.Status)
			case "PORTS":
				row = append(row, truncateDisplayWidth(container.Ports, 30))
			}
		}

		rows = append(rows, row)
	}

	fmt.Print(CreateDockerTable(headers, rows, terminalWidth, hiddenColumnsFooter(columns.hidden)))
	return nil
}

// renderImages renders docker images output with custom table styling
func renderImages(args []string) error {
	terminalWidth := getTerminalWidth()

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

	fmt.Print(CreateDockerTable(headers, rows, terminalWidth, ""))
	return nil
}

type containerColumns struct {
	visible []string
	hidden  []string
}

func getContainerColumns(terminalWidth int, showAllColumns bool) containerColumns {
	visible := []string{"CONTAINER ID", "NAMES", "IMAGE", "COMMAND", "CREATED", "STATUS", "PORTS"}
	hidden := []string{}

	if showAllColumns {
		return containerColumns{
			visible: visible,
			hidden:  hidden,
		}
	}

	if terminalWidth <= 120 {
		visible = removeHeader(visible, "COMMAND")
		hidden = append(hidden, "COMMAND")
	}

	if terminalWidth <= 100 {
		visible = removeHeader(visible, "PORTS")
		hidden = append(hidden, "PORTS")
	}

	if terminalWidth <= 86 {
		visible = removeHeader(visible, "IMAGE")
		hidden = append(hidden, "IMAGE")
	}

	if terminalWidth <= 72 {
		visible = removeHeader(visible, "CREATED")
		hidden = append(hidden, "CREATED")
	}

	return containerColumns{
		visible: visible,
		hidden:  hidden,
	}
}

func removeHeader(headers []string, target string) []string {
	filtered := make([]string, 0, len(headers))
	for _, header := range headers {
		if header == target {
			continue
		}

		filtered = append(filtered, header)
	}

	return filtered
}

func getTerminalWidth() int {
	terminalWidth, _, err := term.GetSize(int(os.Stdout.Fd()))
	if err != nil {
		return 120
	}

	if terminalWidth <= 1 {
		return 120
	}

	return terminalWidth - 1
}

func truncateDisplayWidth(value string, maxWidth int) string {
	if maxWidth <= 0 {
		return ""
	}

	return ansi.Truncate(value, maxWidth, "…")
}

func hiddenColumnsFooter(hidden []string) string {
	if len(hidden) == 0 {
		return ""
	}

	return fmt.Sprintf("+%d columns hidden (%s). use %s to keep all columns.",
		len(hidden),
		strings.Join(hidden, ", "),
		allColumnsFlag)
}

func parseRenderOptions(args []string) ([]string, renderOptions) {
	cleanArgs := make([]string, 0, len(args))
	options := renderOptions{}

	for _, arg := range args {
		if arg == allColumnsFlag || arg == allColumnsAliasFlag {
			options.showAllColumns = true
			continue
		}

		cleanArgs = append(cleanArgs, arg)
	}

	return cleanArgs, options
}

// StripSupdockRenderFlags removes supdock-only flags before raw docker fallback.
func StripSupdockRenderFlags(args []string) []string {
	cleanArgs, _ := parseRenderOptions(args)
	return cleanArgs
}
