package cmd

import (
	"fmt"
	"os"

	"github.com/charmbracelet/lipgloss"
	"github.com/segersniels/supdock/internal/exec"
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
		exec.SmartPassthrough(args)
		return
	}

	// Known command, let cobra handle it
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

	// Custom commands
	sshBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("2")).Render("ssh") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Interactive SSH"))

	envBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("3")).Render("env") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("View variables"))

	catBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("5")).Render("cat") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("View files"))

	pruneBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("1")).Render("prune") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Clean up"))

	// Enhanced rendering
	psBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("4")).Render("ps") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Container cards"))

	imagesBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("6")).Render("images") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Image tables"))

	// Interactive prompts
	startBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("2")).Render("start") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Interactive start"))

	stopBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("1")).Render("stop") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Interactive stop"))

	logsBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("3")).Render("logs") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Interactive logs"))

	rmBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("1")).Render("rm") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Interactive rm"))

	rmiBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("5")).Render("rmi") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Interactive rmi"))

	inspectBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("6")).Render("inspect") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Interactive inspect"))

	restartBox := commandBoxStyle.Copy().Render(
		lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("3")).Render("restart") + "\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Interactive restart"))

	// Custom commands section
	customTitle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("6")).
		MarginTop(1).
		Render("Custom commands:")

	customRow1 := lipgloss.JoinHorizontal(lipgloss.Top, sshBox, envBox)
	customRow2 := lipgloss.JoinHorizontal(lipgloss.Top, catBox, pruneBox)
	customCommands := lipgloss.JoinVertical(lipgloss.Left, customRow1, customRow2)
	customSection := lipgloss.JoinVertical(lipgloss.Left, customTitle, customCommands)

	// Enhanced commands section
	enhancedTitle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("6")).
		MarginTop(1).
		Render("Enhanced commands:")

	enhancedRow1 := lipgloss.JoinHorizontal(lipgloss.Top, psBox, imagesBox)
	enhancedRow2 := lipgloss.JoinHorizontal(lipgloss.Top, startBox, stopBox)
	enhancedRow3 := lipgloss.JoinHorizontal(lipgloss.Top, restartBox, logsBox)
	enhancedRow4 := lipgloss.JoinHorizontal(lipgloss.Top, rmBox, rmiBox)
	enhancedRow5 := lipgloss.JoinHorizontal(lipgloss.Top, inspectBox)
	enhancedCommands := lipgloss.JoinVertical(lipgloss.Left, enhancedRow1, enhancedRow2, enhancedRow3, enhancedRow4, enhancedRow5)
	enhancedSection := lipgloss.JoinVertical(lipgloss.Left, enhancedTitle, enhancedCommands)

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
