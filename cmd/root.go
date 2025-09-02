package cmd

import (
	"fmt"
	"os"

	"github.com/charmbracelet/lipgloss"
	"github.com/segersniels/supdock/internal/exec"
	supLog "github.com/segersniels/supdock/internal/log"
	"github.com/segersniels/supdock/pkg/style"
	"github.com/spf13/cobra"
)

const version = "4.0.0"

var rootCmd = &cobra.Command{
	Use:   "supdock",
	Short: "What's Up, Doc(ker)?",
	Long: `What's Up, Doc(ker)? A convenient way to interact with the docker daemon.
Supdock is a wrapper for the docker command meaning you can still use all of the other docker commands without issues.`,
	Version: version,
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			cmd.Help()
			return
		}

		// Handle unknown commands with smart passthrough
		exec.SmartPassthrough(args)
	},
}

func Execute() {
	args := os.Args[1:]
	supLog.Debug("supdock:", args)

	// If no arguments, show help with styling
	if len(args) == 0 {
		showStyledHelp()
		return
	}

	// Check for special flags that should be handled by supdock
	if len(args) == 1 {
		switch args[0] {
		case "--help", "-h":
			showStyledHelp()
			return
		case "--version", "-v":
			showStyledVersion()
			return
		}
	}

	// Check if the first argument is a known supdock command
	cmd, _, err := rootCmd.Find(args)
	if err != nil || cmd == rootCmd {
		// Unknown command, pass through to docker
		supLog.Debug("passthrough to docker:", args[0])
		exec.SmartPassthrough(args)
		return
	}

	// Known command, let cobra handle it
	supLog.Debug("supdock command:", cmd.Name())
	rootCmd.SetArgs(args)
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

// showStyledHelp displays a beautiful help message with layout
func showStyledHelp() {
	// Header - back to simple blue
	header := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("6")). // Cyan from terminal
		MarginBottom(1).
		Render("What's Up, Doc(ker)? 🐳")

	subtitle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("8")). // Gray
		Italic(true).
		Render("A fast Docker wrapper with interactive prompts")

	// Command boxes
	commandBoxStyle := lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(lipgloss.Color("4")). // Blue
		Padding(0, 2).
		MarginRight(2).
		Width(26)

	// Command definitions
	type Command struct {
		Name        string
		Description string
		Color       string
	}

	// Helper function to create command grids
	createCommandGrid := func(commands []Command) string {
		var rows []string
		for i := 0; i < len(commands); i += 2 {
			var rowBoxes []string
			
			// First box in row
			box1 := commandBoxStyle.Copy().Render(
				lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color(commands[i].Color)).Render(commands[i].Name) + "\n" +
					lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render(commands[i].Description))
			rowBoxes = append(rowBoxes, box1)
			
			// Second box in row (if exists)
			if i+1 < len(commands) {
				box2 := commandBoxStyle.Copy().Render(
					lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color(commands[i+1].Color)).Render(commands[i+1].Name) + "\n" +
						lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render(commands[i+1].Description))
				rowBoxes = append(rowBoxes, box2)
			}
			
			rows = append(rows, lipgloss.JoinHorizontal(lipgloss.Top, rowBoxes...))
		}
		return lipgloss.JoinVertical(lipgloss.Left, rows...)
	}

	customCommands := []Command{
		{"ssh", "Interactive SSH", "2"},
		{"env", "View variables", "3"},
		{"cat", "View files", "5"},
		{"prune", "Clean up", "1"},
	}

	enhancedCommands := []Command{
		{"ps", "Container cards", "4"},
		{"images", "Image tables", "6"},
		{"start", "Interactive start", "2"},
		{"stop", "Interactive stop", "1"},
		{"restart", "Interactive restart", "3"},
		{"logs", "Interactive logs", "3"},
		{"rm", "Interactive rm", "1"},
		{"rmi", "Interactive rmi", "5"},
		{"inspect", "Interactive inspect", "6"},
	}

	// Custom commands section
	customTitle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("6")).
		MarginTop(1).
		Render("Custom commands:")

	customSection := lipgloss.JoinVertical(lipgloss.Left, customTitle, createCommandGrid(customCommands))

	// Enhanced commands section
	enhancedTitle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("6")).
		MarginTop(1).
		Render("Enhanced commands:")

	enhancedSection := lipgloss.JoinVertical(lipgloss.Left, enhancedTitle, createCommandGrid(enhancedCommands))

	commandGrid := lipgloss.JoinVertical(lipgloss.Left, customSection, enhancedSection)

	// Usage section
	usageTitle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("6")).
		MarginTop(1).
		Render("Usage:")

	usageStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("")).
		MarginLeft(2)

	usage := usageStyle.Render("supdock [command]\nsupdock <docker-command> [args...]")

	// Footer
	footerStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("8")).
		MarginTop(1).
		Italic(true)

	footer := footerStyle.Render("All other Docker commands work normally.\nFor full Docker help: docker help")

	// Combine everything
	content := lipgloss.JoinVertical(
		lipgloss.Left,
		header,
		subtitle,
		"",
		commandGrid,
		usageTitle,
		usage,
		footer,
	)

	fmt.Println(content)
}

// showStyledVersion displays a clean version message
func showStyledVersion() {
	fmt.Println(style.AppStyles.Blue.Bold(true).Render(fmt.Sprintf("supdock v%s", version)))
}

func init() {
	rootCmd.SetHelpTemplate(`{{.Long}}

Usage:{{if .Runnable}}
  {{.UseLine}}{{end}}{{if .HasAvailableSubCommands}}
  {{.CommandPath}} [command]{{end}}

Available Commands:{{range .Commands}}{{if (or .IsAvailableCommand (eq .Name "help"))}}
  {{rpad .Name .NamePadding }} {{.Short}}{{end}}{{end}}{{if .HasAvailableLocalFlags}}

Options:
{{.LocalFlags.FlagUsages | trimTrailingWhitespaces}}{{end}}{{if .HasAvailableInheritedFlags}}

Global Options:
{{.InheritedFlags.FlagUsages | trimTrailingWhitespaces}}{{end}}{{if .HasHelpSubCommands}}

Additional help topics:{{range .Commands}}{{if .IsAdditionalHelpTopicCommand}}
  {{rpad .Name .NamePadding }} {{.Short}}{{end}}{{end}}{{end}}{{if .HasAvailableSubCommands}}

Use "{{.CommandPath}} [command] --help" for more information about a command.{{end}}

This only displays "supdock" specific commands. For more detailed usage on docker refer to "docker help"
`)
}
