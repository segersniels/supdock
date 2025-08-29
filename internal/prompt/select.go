package prompt

import (
	"context"
	"fmt"
	"strings"

	"github.com/charmbracelet/huh"
	"github.com/segersniels/supdock/internal/docker"
	"github.com/segersniels/supdock/pkg/style"
)

type Prompter struct {
	dockerClient *docker.Client
}

func NewPrompter() (*Prompter, error) {
	client, err := docker.NewClient()
	if err != nil {
		return nil, fmt.Errorf("failed to create docker client: %w", err)
	}

	return &Prompter{dockerClient: client}, nil
}

func (p *Prompter) Close() error {
	return p.dockerClient.Close()
}

// ListContainers returns container information for fuzzy search
func (p *Prompter) ListContainers(ctx context.Context, containerType docker.ContainerType) ([]docker.ContainerInfo, error) {
	return p.dockerClient.ListContainers(ctx, containerType)
}

// PromptContainerSelection shows an interactive container selection prompt
func (p *Prompter) PromptContainerSelection(ctx context.Context, message string, containerType docker.ContainerType) (string, error) {
	containers, err := p.dockerClient.ListContainers(ctx, containerType)
	if err != nil {
		return "", fmt.Errorf("failed to list containers: %w", err)
	}

	if len(containers) == 0 {
		return "", fmt.Errorf("no containers found")
	}

	// Build options with fabulous styling including status indicators
	options := make([]huh.Option[string], len(containers))
	for i, container := range containers {
		displayText := style.FormatContainerOption(container.ID, container.Name, container.Image, container.State)
		options[i] = huh.NewOption(displayText, container.ID)
	}

	var selected string
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewSelect[string]().
				Title(message).
				Options(options...).
				Value(&selected),
		),
	).WithTheme(style.CreateAdaptiveTheme())

	if err := form.Run(); err != nil {
		return "", fmt.Errorf("prompt cancelled: %w", err)
	}

	return selected, nil
}

// PromptImageSelection shows an interactive image selection prompt
func (p *Prompter) PromptImageSelection(ctx context.Context, message string) (string, error) {
	images, err := p.dockerClient.ListImages(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to list images: %w", err)
	}

	if len(images) == 0 {
		return "", fmt.Errorf("no images found")
	}

	// Build options with fabulous styling
	options := make([]huh.Option[string], len(images))
	for i, image := range images {
		displayText := style.FormatImageOption(image.ID, image.Name)
		options[i] = huh.NewOption(displayText, image.ID)
	}

	var selected string
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewSelect[string]().
				Title(message).
				Options(options...).
				Value(&selected),
		),
	).WithTheme(style.CreateAdaptiveTheme())

	if err := form.Run(); err != nil {
		return "", fmt.Errorf("prompt cancelled: %w", err)
	}

	return selected, nil
}

// PromptFromChoices shows a selection prompt from pre-built choices
func (p *Prompter) PromptFromChoices(message string, choices []string) (string, error) {
	if len(choices) == 0 {
		return "", fmt.Errorf("no choices provided")
	}

	options := make([]huh.Option[string], len(choices))
	for i, choice := range choices {
		// Extract ID from formatted choice (format: "id - name (image)")
		id := extractIDFromChoice(choice)
		options[i] = huh.NewOption(choice, id)
	}

	var selected string
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewSelect[string]().
				Title(style.AppStyles.Blue.Bold(true).Render(message)).
				Options(options...).
				Value(&selected),
		),
	).WithTheme(huh.ThemeCharm())

	if err := form.Run(); err != nil {
		return "", fmt.Errorf("prompt cancelled: %w", err)
	}

	return selected, nil
}

// PromptShellSelection prompts for shell selection
func (p *Prompter) PromptShellSelection() (string, error) {
	shells := []string{"bash", "ash", "sh"}

	options := make([]huh.Option[string], len(shells))
	for i, shell := range shells {
		// Add shell icons for visual appeal
		var icon string
		switch shell {
		case "bash":
			icon = "🐚"
		case "ash":
			icon = "🔥"
		case "sh":
			icon = "⚡"
		}

		displayText := fmt.Sprintf("%s %s", icon, shell)
		options[i] = huh.NewOption(displayText, shell)
	}

	var selected string
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewSelect[string]().
				Title("Choose shell:").
				Options(options...).
				Value(&selected),
		),
	).WithTheme(style.CreateAdaptiveTheme())

	if err := form.Run(); err != nil {
		return "", fmt.Errorf("prompt cancelled: %w", err)
	}

	return selected, nil
}

// extractIDFromChoice extracts container ID from formatted choice string
// Format: "8ee008c67aed - foo (nginx:1.19)" -> "8ee008c67aed"
func extractIDFromChoice(choice string) string {
	parts := strings.Split(choice, " - ")
	if len(parts) > 0 {
		return strings.TrimSpace(parts[0])
	}
	return choice
}
