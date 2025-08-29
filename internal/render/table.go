package render

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/lipgloss/table"
	"github.com/segersniels/supdock/pkg/style"
)

// CreateDockerTable creates a beautifully styled Docker table using our centralized stylesheet
func CreateDockerTable(headers []string, rows [][]string) string {
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

	return t.Render() + "\n"
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
		return styles.ID.Render(content)
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

// FormatSize formats byte sizes in human-readable format
func FormatSize(bytes int64) string {
	const unit = 1024
	if bytes < unit {
		return fmt.Sprintf("%dB", bytes)
	}

	div, exp := int64(unit), 0
	for n := bytes / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}

	return fmt.Sprintf("%.1f%cB", float64(bytes)/float64(div), "KMGTPE"[exp])
}

// FormatAge formats time duration in human-readable format
func FormatAge(createdAt string) string {
	// Try to parse different time formats Docker might use
	layouts := []string{
		time.RFC3339,
		time.RFC3339Nano,
		"2006-01-02 15:04:05 -0700 MST",
		"2006-01-02T15:04:05.000000000Z",
	}

	var created time.Time
	var err error

	for _, layout := range layouts {
		created, err = time.Parse(layout, createdAt)
		if err == nil {
			break
		}
	}

	if err != nil {
		// If we can't parse, try to extract a Unix timestamp
		if timestamp, err := strconv.ParseInt(createdAt, 10, 64); err == nil {
			created = time.Unix(timestamp, 0)
		} else {
			return createdAt // Return as-is if we can't parse
		}
	}

	duration := time.Since(created)

	if duration.Hours() > 24 {
		days := int(duration.Hours() / 24)
		return fmt.Sprintf("%d days ago", days)
	} else if duration.Hours() > 1 {
		return fmt.Sprintf("%d hours ago", int(duration.Hours()))
	} else if duration.Minutes() > 1 {
		return fmt.Sprintf("%d minutes ago", int(duration.Minutes()))
	} else {
		return fmt.Sprintf("%d seconds ago", int(duration.Seconds()))
	}
}
