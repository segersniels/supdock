package render

import (
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/lipgloss/table"
	"github.com/segersniels/supdock/pkg/style"
)

// CreateDockerTable creates a beautifully styled Docker table using our centralized stylesheet
func CreateDockerTable(headers []string, rows [][]string, maxWidth int, footer string) string {
	styles := style.AppStyles

	// Create table with subtle border styling
	t := table.New().
		Border(lipgloss.RoundedBorder()).
		BorderStyle(styles.Gray).
		Wrap(false).
		StyleFunc(func(row, col int) lipgloss.Style {
			baseStyle := lipgloss.NewStyle().Padding(0, 1)

			switch {
			case row == table.HeaderRow:
				return baseStyle.Copy().
					Bold(true).
					Foreground(styles.Blue.GetForeground()).
					Align(lipgloss.Center)
			case row%2 == 0:
				return baseStyle.Copy().Foreground(styles.Default.GetForeground())
			default:
				return baseStyle.Copy().Foreground(styles.Gray.GetForeground())
			}
		}).
		Headers(headers...)

	// Add rows with intelligent styling based on column content
	for _, row := range rows {
		styledRow := make([]string, len(row))
		for i, cell := range row {
			cleanCell := strings.ReplaceAll(cell, "\n", " ")
			cleanCell = strings.TrimSpace(cleanCell)

			// Apply intelligent styling based on column type
			styledRow[i] = styleTableCell(cleanCell, headers[i], styles)
		}
		t.Row(styledRow...)
	}

	rendered := t.Render() + "\n"
	shouldCapWidth := maxWidth > 0 && renderedExceedsWidth(rendered, maxWidth)
	if shouldCapWidth {
		t.Width(maxWidth)
		rendered = t.Render() + "\n"
	}

	if footer == "" {
		return rendered
	}

	footerStyle := styles.Gray.Copy()
	if maxWidth > 0 && (shouldCapWidth || lipgloss.Width(footer) > maxWidth) {
		footerStyle = footerStyle.MaxWidth(maxWidth)
	}

	return rendered + footerStyle.Render(footer) + "\n"
}

func renderedExceedsWidth(rendered string, maxWidth int) bool {
	lines := strings.Split(rendered, "\n")
	for _, line := range lines {
		if lipgloss.Width(line) > maxWidth {
			return true
		}
	}

	return false
}

// styleTableCell applies appropriate styling based on column type and content
func styleTableCell(content, header string, styles *style.Styles) string {
	if content == "" {
		return content
	}

	header = strings.ToUpper(header)

	switch header {
	case "REPOSITORY":
		return styles.Green.Render(content)
	case "TAG":
		return styles.Yellow.Render(content)
	case "IMAGE ID", "CONTAINER ID", "ID":
		// Use gradient based on the ID itself for visual distinction
		return style.CreateContainerGradient(content, content)
	case "CREATED", "AGE":
		return styles.Age.Render(content)
	case "SIZE":
		return styles.Default.Render(content)
	case "STATUS":
		return styleStatus(content, styles)
	case "PORTS":
		return styles.Ports.Render(content)
	case "NAMES", "NAME":
		return styles.ContainerName.Render(content)
	case "COMMAND", "CMD":
		return styles.Command.Render(content)
	case "IMAGE":
		return styles.Default.Render(content)
	default:
		return styles.Default.Render(content)
	}
}

// styleStatus applies appropriate styling to status text using our centralized styles
func styleStatus(status string, styles *style.Styles) string {
	lowerStatus := strings.ToLower(status)

	if strings.Contains(lowerStatus, "running") || strings.Contains(lowerStatus, "up") {
		return styles.ContainerRunning.Render("● " + status)
	} else if strings.Contains(lowerStatus, "exited") {
		return styles.ContainerStopped.Render("● " + status)
	} else {
		return styles.Gray.Render("● " + status)
	}
}
