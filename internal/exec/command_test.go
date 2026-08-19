package exec_test

import (
	"os"
	"path/filepath"
	"reflect"
	"runtime"
	"testing"

	supexec "github.com/segersniels/supdock/internal/exec"
)

func TestRunDockerCommandWithOutputCapturesOnlyStderr(t *testing.T) {
	if runtime.GOOS == "windows" {
		t.Skip("test helper uses a POSIX shell script")
	}

	dir := t.TempDir()
	docker := filepath.Join(dir, "docker")
	script := []byte("#!/bin/sh\nprintf 'visible output\\n'\nprintf 'warning output\\n' >&2\n")
	if err := os.WriteFile(docker, script, 0o755); err != nil {
		t.Fatalf("write fake docker binary: %v", err)
	}
	t.Setenv("PATH", dir+string(os.PathListSeparator)+os.Getenv("PATH"))

	output, err := supexec.RunDockerCommandWithOutput("ps")
	if err != nil {
		t.Fatalf("RunDockerCommandWithOutput() error = %v", err)
	}
	if got, want := string(output), "warning output\n"; got != want {
		t.Fatalf("RunDockerCommandWithOutput() = %q, want %q", got, want)
	}
}

func TestReplaceArgChangesOnlyTheResourceArgument(t *testing.T) {
	args := []string{"logs", "web", "--since", "web-start"}
	want := []string{"logs", "aaaaaaaaaaaa", "--since", "web-start"}

	got := supexec.ReplaceArg(args, "web", "aaaaaaaaaaaa")

	if !reflect.DeepEqual(got, want) {
		t.Fatalf("ReplaceArg() = %v, want %v", got, want)
	}
}

func TestResourceKindMatchesDockerCommand(t *testing.T) {
	tests := map[string]supexec.ResourceKind{
		"rmi":     supexec.ImageResource,
		"history": supexec.ImageResource,
		"logs":    supexec.ContainerResource,
		"inspect": supexec.ContainerResource,
	}

	for command, want := range tests {
		t.Run(command, func(t *testing.T) {
			if got := supexec.ResourceKindForCommand(command); got != want {
				t.Fatalf("ResourceKindForCommand(%q) = %q, want %q", command, got, want)
			}
		})
	}
}

func TestMissingResourceFromDockerError(t *testing.T) {
	tests := map[string]string{
		"Error response from daemon: No such container: acme-cahce":   "acme-cahce",
		"Error response from daemon: No such image: acme/cache:lates": "acme/cache:lates",
		"error: no such object: acme-cahce":                           "acme-cahce",
	}

	for message, want := range tests {
		t.Run(message, func(t *testing.T) {
			got, ok := supexec.MissingResourceFromError(message)
			if !ok || got != want {
				t.Fatalf("MissingResourceFromError() = %q, %t, want %q, true", got, ok, want)
			}
		})
	}
}
