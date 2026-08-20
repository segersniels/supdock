package render_test

import (
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/segersniels/supdock/internal/render"
)

func TestInterceptDockerCommandRejectsMalformedDockerOutput(t *testing.T) {
	if runtime.GOOS == "windows" {
		t.Skip("test helper uses a POSIX shell script")
	}

	dir := t.TempDir()
	docker := filepath.Join(dir, "docker")
	if err := os.WriteFile(docker, []byte("#!/bin/sh\nprintf 'not-json\\n'\n"), 0o755); err != nil {
		t.Fatalf("write fake docker binary: %v", err)
	}
	t.Setenv("PATH", dir+string(os.PathListSeparator)+os.Getenv("PATH"))

	for _, command := range []string{"ps", "images"} {
		t.Run(command, func(t *testing.T) {
			if err := render.InterceptDockerCommand([]string{command}); err == nil {
				t.Fatal("InterceptDockerCommand() error = nil, want malformed output error")
			}
		})
	}
}
