package search

import (
	"strings"
	"sync"

	"github.com/lithammer/fuzzysearch/fuzzy"
	"github.com/segersniels/supdock/internal/constants"
)

// SearchResult represents a search match with its score
type SearchResult struct {
	Text  string
	Score int
}

// FuzzySearch performs parallel fuzzy search on the given haystack
func FuzzySearch(haystack []string, needle string, threshold float64) []string {
	if len(haystack) == 0 || needle == "" {
		return []string{}
	}

	var wg sync.WaitGroup
	var mu sync.Mutex
	results := make([]string, 0)

	// Channel to limit concurrent goroutines
	semaphore := make(chan struct{}, constants.MaxConcurrentSearches)

	for _, candidate := range haystack {
		wg.Add(1)
		go func(candidate string) {
			defer wg.Done()
			semaphore <- struct{}{}        // Acquire
			defer func() { <-semaphore }() // Release

			if isMatch(candidate, needle, threshold) {
				mu.Lock()
				results = append(results, candidate)
				mu.Unlock()
			}
		}(candidate)
	}

	wg.Wait()
	return results
}

// isMatch checks if a candidate matches the needle with the given threshold
func isMatch(candidate, needle string, threshold float64) bool {
	candidate = strings.ToLower(candidate)
	needle = strings.ToLower(needle)

	// Direct substring match gets highest priority
	if strings.Contains(candidate, needle) {
		return true
	}

	// Split candidate into words and check each word
	words := parseWords(candidate)
	for _, word := range words {
		// Check fuzzy match score
		if fuzzy.RankMatchFold(needle, word) > 0 {
			return true
		}

		// Check substring match in word
		if strings.Contains(word, needle) {
			return true
		}

		// If word contains dashes, check parts separately
		if strings.Contains(word, "-") {
			dashParts := strings.Split(word, "-")
			for _, part := range dashParts {
				if strings.Contains(part, needle) || fuzzy.RankMatchFold(needle, part) > 0 {
					return true
				}
			}
		}
	}

	return false
}

// parseWords splits a string into words, filtering out empty strings
func parseWords(text string) []string {
	// Split by common separators
	separators := []string{" ", "-", "_", ".", "(", ")", "[", "]"}

	words := []string{text}
	for _, sep := range separators {
		var newWords []string
		for _, word := range words {
			parts := strings.Split(word, sep)
			for _, part := range parts {
				part = strings.TrimSpace(part)
				if part != "" {
					newWords = append(newWords, part)
				}
			}
		}
		words = newWords
	}

	// Remove duplicates
	seen := make(map[string]bool)
	unique := make([]string, 0)
	for _, word := range words {
		if !seen[word] {
			seen[word] = true
			unique = append(unique, word)
		}
	}

	return unique
}
