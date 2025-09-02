package style

import (
	"fmt"
	"strings"

	"github.com/charmbracelet/huh"
	"github.com/charmbracelet/lipgloss"
	"github.com/muesli/gamut"
)

// CreateAdaptiveTheme creates a Huh theme that respects terminal colors
func CreateAdaptiveTheme() *huh.Theme {
	styles := AppStyles
	theme := huh.ThemeCharm()

	// Customize with our stylesheet
	theme.Focused.Title = styles.Blue.Bold(true)
	theme.Focused.SelectSelector = styles.Blue.SetString("→ ")
	theme.Focused.MultiSelectSelector = styles.Blue.SetString("→ ")
	theme.Focused.Description = styles.Gray

	// Respect terminal's selection colors
	theme.Focused.SelectedOption = styles.Bold
	theme.Focused.UnselectedOption = styles.Gray

	return theme
}

// FormatContainerOption - clean with stylesheet styling
func FormatContainerOption(id, name, image, status string) string {
	styles := AppStyles
	var statusDot string
	if status == "running" {
		statusDot = styles.ContainerRunning.Render("●")
	} else {
		statusDot = styles.ContainerStopped.Render("○")
	}

	idPart := styles.ID.Render(id[:12])
	namePart := styles.ContainerName.Render(name)
	imagePart := styles.Gray.Render("(" + image + ")")

	return fmt.Sprintf("%s %s %s %s", statusDot, idPart, namePart, imagePart)
}

// FormatImageOption - simple with stylesheet styling
func FormatImageOption(id, name string) string {
	styles := AppStyles
	return styles.ID.Render(id) + " " + styles.ImageName.Render(name)
}

// Message functions using the stylesheet
func CreateSuccessMessage(message string) string {
	styles := AppStyles
	return styles.Green.Bold(true).Render("✓ " + message)
}

func CreateErrorMessage(message string) string {
	styles := AppStyles
	return styles.Red.Bold(true).Render("✗ " + message)
}

func CreateWarningMessage(message string) string {
	styles := AppStyles
	return styles.Yellow.Bold(true).Render("⚠ " + message)
}

// CreateInfoBox - elegant but minimal
func CreateInfoBox(title, content string) string {
	styles := AppStyles
	titleLine := styles.Blue.Bold(true).Underline(true).Render(title)
	contentBox := styles.ContainerCard.Render(content)

	return lipgloss.JoinVertical(lipgloss.Left, titleLine, contentBox)
}

// CreateWelcomeBox - tasteful welcome message
func CreateWelcomeBox(message string) string {
	styles := AppStyles
	return lipgloss.NewStyle().
		Border(lipgloss.ThickBorder()).
		BorderForeground(styles.Border.GetForeground()).
		Padding(1, 3).
		Align(lipgloss.Center).
		Bold(true).
		Render(message)
}

// CreateGradientText creates a smooth gradient effect using gamut
func CreateGradientText(text string) string {
	if len(text) == 0 {
		return text
	}

	// Parse colors for gamut
	color1 := gamut.Hex("#4A90E2") // Blue
	color2 := gamut.Hex("#E74C3C") // Red

	// Create a smooth gradient
	colors := gamut.Blends(color1, color2, len(text))

	var result strings.Builder
	for i, char := range text {
		if char == ' ' {
			result.WriteRune(char)
			continue
		}

		if i < len(colors) {
			hexColor := gamut.ToHex(colors[i])
			style := lipgloss.NewStyle().Foreground(lipgloss.Color(hexColor))
			result.WriteString(style.Render(string(char)))
		} else {
			result.WriteRune(char)
		}
	}

	return result.String()
}

// CreateRainbowGradient creates a rainbow gradient effect
func CreateRainbowGradient(text string) string {
	if len(text) == 0 {
		return text
	}

	// Create multiple gradient segments for rainbow effect
	textRunes := []rune(text)
	textLen := len(textRunes)

	// Define rainbow colors
	rainbowColors := []string{"#FF6B6B", "#FFE66D", "#4ECDC4", "#45B7D1", "#9B59B6"}

	var result strings.Builder
	segmentSize := textLen / len(rainbowColors)
	if segmentSize < 1 {
		segmentSize = 1
	}

	for i, char := range textRunes {
		if char == ' ' {
			result.WriteRune(char)
			continue
		}

		// Determine which color segment we're in
		segmentIndex := i / segmentSize
		if segmentIndex >= len(rainbowColors)-1 {
			segmentIndex = len(rainbowColors) - 2
		}

		// Create gradient between current and next color
		color1 := gamut.Hex(rainbowColors[segmentIndex])
		color2 := gamut.Hex(rainbowColors[segmentIndex+1])

		// Calculate position within segment
		segmentPos := i % segmentSize
		colors := gamut.Blends(color1, color2, segmentSize)

		if segmentPos < len(colors) {
			hexColor := gamut.ToHex(colors[segmentPos])
			style := lipgloss.NewStyle().Foreground(lipgloss.Color(hexColor))
			result.WriteString(style.Render(string(char)))
		} else {
			result.WriteRune(char)
		}
	}

	return result.String()
}

// CreateOriginalGradientText creates gradient text with the original suggested colors
func CreateOriginalGradientText(text string) string {
	if len(text) == 0 {
		return text
	}

	// Use original suggested gradient - #3fa2ca to #eb6f92
	color1 := gamut.Hex("#3fa2ca") // Blue
	color2 := gamut.Hex("#eb6f92") // Pink

	colors := gamut.Blends(color1, color2, len(text))

	var result strings.Builder
	for i, char := range text {
		if char == ' ' {
			result.WriteRune(char)
			continue
		}

		if i < len(colors) {
			hexColor := gamut.ToHex(colors[i])
			style := lipgloss.NewStyle().Foreground(lipgloss.Color(hexColor))
			result.WriteString(style.Render(string(char)))
		} else {
			result.WriteRune(char)
		}
	}

	return result.String()
}

// CreateContainerGradient creates a unique gradient for each container based on its ID
func CreateContainerGradient(text, containerID string) string {
	if len(text) == 0 {
		return text
	}

	// Use container ID to generate deterministic colors
	hash := 0
	for _, char := range containerID {
		hash = hash*31 + int(char)
	}

	// Generate two colors based on the hash
	hue1 := (hash % 360)
	hue2 := ((hash * 17) % 360) // Different multiplier for second color

	// Convert HSL to approximate hex (simplified) - using pastel colors
	color1Hex := hslToHex(hue1, 55, 70)
	color2Hex := hslToHex(hue2, 55, 70)

	color1 := gamut.Hex(color1Hex)
	color2 := gamut.Hex(color2Hex)

	colors := gamut.Blends(color1, color2, len(text))

	var result strings.Builder
	for i, char := range text {
		if char == ' ' {
			result.WriteRune(char)
			continue
		}

		if i < len(colors) {
			hexColor := gamut.ToHex(colors[i])
			style := lipgloss.NewStyle().Foreground(lipgloss.Color(hexColor))
			result.WriteString(style.Render(string(char)))
		} else {
			result.WriteRune(char)
		}
	}

	return result.String()
}

// Simple HSL to hex conversion
func hslToHex(h, s, l int) string {
	// Convert to 0-1 range
	hf := float64(h) / 360.0
	sf := float64(s) / 100.0
	lf := float64(l) / 100.0

	c := (1 - abs(2*lf-1)) * sf
	x := c * (1 - abs(mod(hf*6, 2)-1))
	m := lf - c/2

	var r, g, b float64
	switch int(hf * 6) {
	case 0:
		r, g, b = c+m, x+m, m
	case 1:
		r, g, b = x+m, c+m, m
	case 2:
		r, g, b = m, c+m, x+m
	case 3:
		r, g, b = m, x+m, c+m
	case 4:
		r, g, b = x+m, m, c+m
	default:
		r, g, b = c+m, m, x+m
	}

	return fmt.Sprintf("#%02x%02x%02x", int(r*255), int(g*255), int(b*255))
}

func abs(x float64) float64 {
	if x < 0 {
		return -x
	}
	return x
}

func mod(x, y float64) float64 {
	return x - y*float64(int(x/y))
}
