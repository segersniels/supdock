package render

import (
	"fmt"
	"os"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/segersniels/supdock/internal/constants"
	"github.com/segersniels/supdock/pkg/style"
	"golang.org/x/term"
)

// ContainerCard represents the data for a single container card
type ContainerCard struct {
	ID      string
	Name    string
	Image   string
	Command string
	Created string
	Status  string
	Ports   string
}

// CreateContainerCards renders containers as beautiful compact cards in multiple columns
func CreateContainerCards(containers []ContainerCard) string {
	if len(containers) == 0 {
		return createEmptyMessage("No containers found")
	}

	// Get terminal width for responsive layout
	termWidth := getTerminalWidth()
	maxCardWidth := constants.MaxCardWidth
	estimatedCardWidth := maxCardWidth + constants.CardBorderSpacing
	cardsPerRow := termWidth / estimatedCardWidth
	if cardsPerRow < constants.MinCardsPerRow {
		cardsPerRow = constants.MinCardsPerRow
	}

	// Use the global stylesheet
	styles := style.AppStyles

	var cards []string

	for _, container := range containers {
		// Create unique gradient container name based on container ID
		gradientName := style.CreateContainerGradient(container.Name, container.ID)
		lines := []string{
			"● " + gradientName,
			fmt.Sprintf("%s %s", styles.Label.Render("ID"), styles.ID.Render(container.ID)),
			fmt.Sprintf("%s %s", styles.Label.Render("Image"), styles.Default.Render(container.Image)),
			fmt.Sprintf("%s %s", styles.Label.Render("Command"), styles.Command.Render(container.Command)),
			fmt.Sprintf("%s %s", styles.Label.Render("Age"), styles.Age.Render(container.Created)),
		}

		// Style status with appropriate color - full word instead of abbreviation
		status := strings.ToLower(container.Status)
		if strings.Contains(status, "up") || strings.Contains(status, "running") {
			lines = append(lines, fmt.Sprintf("%s %s",
				styles.Label.Render("Status"),
				styles.ContainerRunning.Render("● "+container.Status)))
		} else {
			lines = append(lines, fmt.Sprintf("%s %s",
				styles.Label.Render("Status"),
				styles.ContainerStopped.Render("● "+container.Status)))
		}

		if container.Ports != "" {
			lines = append(lines, fmt.Sprintf("%s %s",
				styles.Label.Render("Ports"),
				styles.Ports.Render(container.Ports)))
		}

		// Join lines vertically
		cardContent := lipgloss.JoinVertical(lipgloss.Left, lines...)

		// Wrap in card style with max width
		cardStyle := styles.ContainerCard.Copy().MaxWidth(maxCardWidth)
		card := cardStyle.Render(cardContent)
		cards = append(cards, card)
	}

	// Arrange cards in a grid layout and add newline to prevent %
	result := arrangeCardsInGrid(cards, cardsPerRow)
	if result != "" {
		result += "\n"
	}
	return result
}

// CreateImageCards renders images as beautiful compact cards in multiple columns
func CreateImageCards(images []ImageCard) string {
	if len(images) == 0 {
		return createEmptyMessage("No images found")
	}

	// Get terminal width for responsive layout
	termWidth := getTerminalWidth()
	minCardWidth := 35
	cardsPerRow := termWidth / (minCardWidth + 4)
	if cardsPerRow < 1 {
		cardsPerRow = 1
	}

	// Use the global stylesheet
	styles := style.AppStyles

	var cards []string

	for _, image := range images {
		// Create compact image card content with truncation
		repoName := image.Repository
		if image.Tag != "" {
			repoName = fmt.Sprintf("%s:%s", image.Repository, image.Tag)
		}

		// Truncate long repository names
		repoName = truncateString(repoName, 25)

		lines := []string{
			styles.ImageName.Render("◆ " + repoName),
			fmt.Sprintf("%s %s", styles.Label.Render("ID"), styles.ID.Render(image.ID)),
			fmt.Sprintf("%s %s", styles.Label.Render("Age"), styles.Age.Render(image.Created)),
			fmt.Sprintf("%s %s", styles.Label.Render("Size"), styles.Yellow.Render(image.Size)),
		}

		// Join lines vertically
		cardContent := lipgloss.JoinVertical(lipgloss.Left, lines...)

		// Wrap in card style
		card := styles.ImageCard.Render(cardContent)
		cards = append(cards, card)
	}

	// Arrange cards in a grid layout and add newline to prevent %
	result := arrangeCardsInGrid(cards, cardsPerRow)
	if result != "" {
		result += "\n"
	}
	return result
}

// ImageCard represents the data for a single image card
type ImageCard struct {
	Repository string
	Tag        string
	ID         string
	Created    string
	Size       string
}

// createEmptyMessage creates a styled message for when no items are found
func createEmptyMessage(message string) string {
	messageStyle := lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(lipgloss.Color("8")). // Gray
		Padding(1, 2).
		Foreground(lipgloss.Color("8")). // Gray text
		Italic(true).
		Align(lipgloss.Center).
		Width(40)

	return messageStyle.Render(message)
}

// getTerminalWidth gets the current terminal width or returns a default
func getTerminalWidth() int {
	width, _, err := term.GetSize(int(os.Stdout.Fd()))
	if err != nil {
		return constants.DefaultTermWidth
	}
	return width
}

// arrangeCardsInGrid arranges cards in a responsive grid layout
func arrangeCardsInGrid(cards []string, cardsPerRow int) string {
	if len(cards) == 0 {
		return ""
	}

	var rows []string
	for i := 0; i < len(cards); i += cardsPerRow {
		end := i + cardsPerRow
		if end > len(cards) {
			end = len(cards)
		}

		// Join cards horizontally for this row
		row := lipgloss.JoinHorizontal(lipgloss.Top, cards[i:end]...)
		rows = append(rows, row)
	}

	// Join all rows vertically
	return lipgloss.JoinVertical(lipgloss.Left, rows...)
}
