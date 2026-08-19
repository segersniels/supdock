package prompt

import (
	"errors"

	"github.com/charmbracelet/huh"
)

// IsCancelled reports whether the user aborted an interactive prompt.
func IsCancelled(err error) bool {
	return errors.Is(err, huh.ErrUserAborted)
}
