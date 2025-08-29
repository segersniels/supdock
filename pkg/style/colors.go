package style

import "github.com/charmbracelet/lipgloss"

// Styles represents our application's style sheet using terminal colors
type Styles struct {
	// Base text styles
	Bold      lipgloss.Style
	Italic    lipgloss.Style
	Underline lipgloss.Style
	Faint     lipgloss.Style

	// Terminal color palette
	Default lipgloss.Style // Terminal default text color
	Black   lipgloss.Style // Terminal color 0
	Red     lipgloss.Style // Terminal color 1
	Green   lipgloss.Style // Terminal color 2
	Yellow  lipgloss.Style // Terminal color 3
	Blue    lipgloss.Style // Terminal color 4
	Magenta lipgloss.Style // Terminal color 5
	Cyan    lipgloss.Style // Terminal color 6
	White   lipgloss.Style // Terminal color 7
	Gray    lipgloss.Style // Terminal color 8 (bright black)

	// Semantic colors for Docker elements
	ContainerRunning lipgloss.Style // Green for running containers
	ContainerStopped lipgloss.Style // Red for stopped containers
	ContainerName    lipgloss.Style // Cyan for container names
	ImageName        lipgloss.Style // Magenta for image names
	Command          lipgloss.Style // Default for commands
	Ports            lipgloss.Style // Blue for port information
	ID               lipgloss.Style // Yellow for IDs
	Age              lipgloss.Style // Gray for age/timestamps
	Label            lipgloss.Style // Gray for labels with compact width
	Border           lipgloss.Style // Blue for borders

	// Status indicators
	StatusDotRunning lipgloss.Style // Green bullet for running
	StatusDotStopped lipgloss.Style // Red bullet for stopped

	// Card styles
	ContainerCard lipgloss.Style // Container card border
	ImageCard     lipgloss.Style // Image card border
}

// NewStyles creates a new stylesheet using terminal colors
func NewStyles() *Styles {
	return &Styles{
		// Base text styles
		Bold:      lipgloss.NewStyle().Bold(true),
		Italic:    lipgloss.NewStyle().Italic(true),
		Underline: lipgloss.NewStyle().Underline(true),
		Faint:     lipgloss.NewStyle().Faint(true),

		// Terminal color palette
		Default: lipgloss.NewStyle().Foreground(lipgloss.Color("")),  // Terminal default
		Black:   lipgloss.NewStyle().Foreground(lipgloss.Color("0")), // Black
		Red:     lipgloss.NewStyle().Foreground(lipgloss.Color("1")), // Red
		Green:   lipgloss.NewStyle().Foreground(lipgloss.Color("2")), // Green
		Yellow:  lipgloss.NewStyle().Foreground(lipgloss.Color("3")), // Yellow
		Blue:    lipgloss.NewStyle().Foreground(lipgloss.Color("4")), // Blue
		Magenta: lipgloss.NewStyle().Foreground(lipgloss.Color("5")), // Magenta
		Cyan:    lipgloss.NewStyle().Foreground(lipgloss.Color("6")), // Cyan
		White:   lipgloss.NewStyle().Foreground(lipgloss.Color("7")), // White
		Gray:    lipgloss.NewStyle().Foreground(lipgloss.Color("8")), // Bright black (gray)

		// Semantic colors for Docker elements
		ContainerRunning: lipgloss.NewStyle().Foreground(lipgloss.Color("2")).Bold(true), // Green + bold
		ContainerStopped: lipgloss.NewStyle().Foreground(lipgloss.Color("1")).Bold(true), // Red + bold
		ContainerName:    lipgloss.NewStyle().Foreground(lipgloss.Color("6")).Bold(true), // Cyan + bold
		ImageName:        lipgloss.NewStyle().Foreground(lipgloss.Color("5")).Bold(true), // Magenta + bold
		Command:          lipgloss.NewStyle().Foreground(lipgloss.Color("")),             // Default
		Ports:            lipgloss.NewStyle().Foreground(lipgloss.Color("4")),            // Blue
		ID:               lipgloss.NewStyle().Foreground(lipgloss.Color("3")),            // Yellow
		Age:              lipgloss.NewStyle().Foreground(lipgloss.Color("8")),            // Gray
		Label:            lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Width(7),   // Gray with width for alignment
		Border:           lipgloss.NewStyle().Foreground(lipgloss.Color("4")),            // Blue

		// Status indicators
		StatusDotRunning: lipgloss.NewStyle().Foreground(lipgloss.Color("2")).SetString("●"), // Green dot
		StatusDotStopped: lipgloss.NewStyle().Foreground(lipgloss.Color("1")).SetString("●"), // Red dot

		// Card styles - much more compact with subtle borders
		ContainerCard: lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("8")). // Gray - more subtle
			Padding(0, 1).                         // Much less padding
			MarginRight(1).
			MarginBottom(1),

		ImageCard: lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("8")). // Gray - more subtle
			Padding(0, 1).                         // Much less padding
			MarginRight(1).
			MarginBottom(1),
	}
}

// Global styles instance
var AppStyles = NewStyles()
