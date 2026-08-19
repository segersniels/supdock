package prompt_test

import (
	"errors"
	"fmt"
	"testing"

	"github.com/charmbracelet/huh"
	"github.com/segersniels/supdock/internal/prompt"
)

func TestIsCancelledRecognizesOnlyUserAborts(t *testing.T) {
	aborted := fmt.Errorf("prompt cancelled: %w", huh.ErrUserAborted)
	if !prompt.IsCancelled(aborted) {
		t.Fatal("IsCancelled() = false for a wrapped user abort")
	}

	if prompt.IsCancelled(errors.New("terminal unavailable")) {
		t.Fatal("IsCancelled() = true for an ordinary prompt error")
	}
}
