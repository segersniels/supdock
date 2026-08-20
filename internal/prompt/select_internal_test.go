package prompt

import (
	"strings"
	"testing"

	"github.com/segersniels/supdock/internal/docker"
)

func TestResourceOptionsIncludeContainersAndImages(t *testing.T) {
	containers := []docker.ContainerInfo{{
		ID:    "abc123",
		Name:  "acme-api",
		Image: "acme/api:latest",
		State: "running",
	}}
	images := []docker.ImageInfo{{
		ID:   "def456",
		Name: "acme/debug:latest",
	}}

	options := resourceOptions(containers, images)
	if len(options) != 2 {
		t.Fatalf("resourceOptions() returned %d options, want 2", len(options))
	}
	if options[0].Value != "abc123" || !strings.Contains(options[0].Key, "acme-api") {
		t.Fatalf("container option = %#v", options[0])
	}
	if options[1].Value != "def456" || !strings.Contains(options[1].Key, "acme/debug:latest") {
		t.Fatalf("image option = %#v", options[1])
	}
}
