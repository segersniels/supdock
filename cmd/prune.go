package cmd

import (
	"github.com/segersniels/supdock/internal/exec"
	"github.com/spf13/cobra"
)

var (
	pruneInfo    bool
	pruneAll     bool
	pruneVolumes bool
)

var pruneCmd = &cobra.Command{
	Use:   "prune",
	Short: "Remove stopped containers and dangling images",
	Long: `Remove stopped containers and dangling images. For more detailed usage refer to "docker system prune -h"

Examples:
  supdock prune           # Basic prune with confirmation
  supdock prune --info    # Show disk usage before pruning
  supdock prune --all     # Remove all unused images, not just dangling ones
  supdock prune --volumes # Also prune volumes`,
	Run: func(cmd *cobra.Command, args []string) {
		runPrune(cmd, args)
	},
}

func runPrune(cmd *cobra.Command, args []string) {
	// Show disk usage information if requested
	if pruneInfo {
		exec.RunDockerCommandAndExit("system", "df")
		return
	}

	// Build prune command arguments
	pruneArgs := []string{"system", "prune", "-f"}

	// Add flags based on user input
	if pruneAll {
		pruneArgs = append(pruneArgs, "--all")
	}
	if pruneVolumes {
		pruneArgs = append(pruneArgs, "--volumes")
	}

	// Add any additional arguments passed by the user
	pruneArgs = append(pruneArgs, args...)

	// Execute the prune command
	exec.RunDockerCommandAndExit(pruneArgs...)
}

func init() {
	pruneCmd.Flags().BoolVarP(&pruneInfo, "info", "i", false, "Log additional information (show disk usage)")
	pruneCmd.Flags().BoolVarP(&pruneAll, "all", "a", false, "Remove all unused images not just dangling ones")
	pruneCmd.Flags().BoolVar(&pruneVolumes, "volumes", false, "Prune volumes")

	rootCmd.AddCommand(pruneCmd)
}
