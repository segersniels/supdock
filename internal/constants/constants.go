package constants

import "time"

// Docker Operation Constants
const (
	DockerOperationTimeout = 30 * time.Second
	DefaultFuzzyThreshold  = 0.7
)

// Search Constants
const (
	MaxConcurrentSearches = 10
)

// Render Constants
const (
	MaxCardWidth        = 60
	CardBorderSpacing   = 4
	DefaultTermWidth    = 80
	MinCardsPerRow      = 1
)