package cmd_test

import (
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

func TestReleaseBuildReportsInjectedVersion(t *testing.T) {
	binary := filepath.Join(t.TempDir(), "supdock")
	build := exec.Command(
		"go", "build",
		"-ldflags", "-X github.com/segersniels/supdock/cmd.Version=9.9.9",
		"-o", binary,
		"..",
	)
	build.Dir = "."
	if output, err := build.CombinedOutput(); err != nil {
		t.Fatalf("build release binary: %v\n%s", err, output)
	}

	output, err := exec.Command(binary, "--version").CombinedOutput()
	if err != nil {
		t.Fatalf("run release binary: %v\n%s", err, output)
	}

	if got, want := strings.TrimSpace(string(output)), "supdock v9.9.9"; got != want {
		t.Fatalf("supdock --version = %q, want %q", got, want)
	}
}

func TestHelpDoesNotAdvertiseCompletion(t *testing.T) {
	binary := filepath.Join(t.TempDir(), "supdock")
	build := exec.Command("go", "build", "-o", binary, "..")
	build.Dir = "."
	if output, err := build.CombinedOutput(); err != nil {
		t.Fatalf("build binary: %v\n%s", err, output)
	}

	output, err := exec.Command(binary, "--help").CombinedOutput()
	if err != nil {
		t.Fatalf("run supdock --help: %v\n%s", err, output)
	}

	if strings.Contains(string(output), "\n  completion ") {
		t.Fatalf("supdock --help unexpectedly advertises completion:\n%s", output)
	}
}
