package search

import (
	"strings"

	"github.com/xrash/smetrics"
)

// FuzzySearch returns matching entries in their original order.
func FuzzySearch(haystack []string, needle string, threshold float64) []string {
	if len(haystack) == 0 || needle == "" {
		return []string{}
	}

	results := make([]string, 0)
	bestScore := threshold
	for _, candidate := range haystack {
		score := matchScore(candidate, needle)
		switch {
		case score > bestScore:
			bestScore = score
			results = []string{candidate}
		case score == bestScore && score > threshold:
			results = append(results, candidate)
		}
	}

	return results
}

func matchScore(candidate, needle string) float64 {
	candidate = strings.ToLower(candidate)
	needle = strings.ToLower(needle)

	if strings.Contains(candidate, needle) {
		return 1
	}

	bestScore := 0.0
	words := parseWords(candidate)
	for _, word := range words {
		score := smetrics.JaroWinkler(word, needle, 0.7, 4)
		if score > bestScore {
			bestScore = score
		}
	}

	return bestScore
}

func parseWords(text string) []string {
	seen := make(map[string]bool)
	words := make([]string, 0)
	addWord := func(word string) {
		word = strings.Trim(word, "()[]")
		if word != "" && word != "-" && !seen[word] {
			seen[word] = true
			words = append(words, word)
		}
	}

	for _, word := range strings.Fields(text) {
		addWord(word)
		for _, part := range strings.FieldsFunc(word, func(r rune) bool {
			return r == '-' || r == '_' || r == '.' || r == '(' || r == ')' || r == '[' || r == ']'
		}) {
			addWord(part)
		}
	}

	return words
}
