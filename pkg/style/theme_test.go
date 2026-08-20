package style_test

import (
	"strings"
	"testing"

	"github.com/segersniels/supdock/pkg/style"
)

func TestFormatContainerOptionAcceptsShortIDs(t *testing.T) {
	got := style.FormatContainerOption("abc123", "acme-api", "acme/api:1.0", "running")

	if !strings.Contains(got, "abc123") {
		t.Fatalf("FormatContainerOption() = %q, want short ID", got)
	}
}
