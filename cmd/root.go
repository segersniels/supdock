package cmd

import (
	"fmt"
	"os"

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

	// If no arguments, show help
	if len(args) == 0 {
		showHelp()
		return
	}

	// Check for special flags that should be handled by supdock
	if len(args) == 1 {
		switch args[0] {
		case "--help", "-h":
			showHelp()
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

func showHelp() {
	rootCmd.SetArgs([]string{"--help"})
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
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
