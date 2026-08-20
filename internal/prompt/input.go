package prompt

import (
	"fmt"

	"github.com/charmbracelet/huh"
	"github.com/segersniels/supdock/pkg/style"
)

// PromptText shows a text input prompt
func (p *Prompter) PromptText(message string) (string, error) {
	var input string
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewInput().
				Title(message).
				Value(&input).
				Validate(func(s string) error {
					if s == "" {
						return fmt.Errorf("input cannot be empty")
					}
					return nil
				}),
		),
	).WithTheme(style.CreateAdaptiveTheme())

	if err := form.Run(); err != nil {
		return "", fmt.Errorf("prompt cancelled: %w", err)
	}

	return input, nil
}
