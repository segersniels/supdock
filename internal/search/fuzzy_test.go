package search_test

import (
	"reflect"
	"testing"

	"github.com/segersniels/supdock/internal/search"
)

func TestFuzzySearchFindsOrdinaryTypos(t *testing.T) {
	haystack := []string{
		"aaaaaaaaaaaa - acme-api (acme/api:1.0)",
		"bbbbbbbbbbbb - acme-cache (acme/cache:1.0)",
	}

	want := []string{"bbbbbbbbbbbb - acme-cache (acme/cache:1.0)"}
	got := search.FuzzySearch(haystack, "cahce", 0.7)

	if !reflect.DeepEqual(got, want) {
		t.Fatalf("FuzzySearch() = %v, want %v", got, want)
	}
}

func TestFuzzySearchKeepsOnlyTheClosestTypoMatches(t *testing.T) {
	haystack := []string{
		"aaaaaaaaaaaa - acme-api (acme/api:1.0)",
		"bbbbbbbbbbbb - acme-cache (acme/cache:1.0)",
	}

	want := []string{"bbbbbbbbbbbb - acme-cache (acme/cache:1.0)"}
	got := search.FuzzySearch(haystack, "acme-cahce", 0.7)

	if !reflect.DeepEqual(got, want) {
		t.Fatalf("FuzzySearch() = %v, want %v", got, want)
	}
}

func TestFuzzySearchKeepsMultipleExactMatches(t *testing.T) {
	haystack := []string{
		"aaaaaaaaaaaa - acme-api (acme/api:1.0)",
		"bbbbbbbbbbbb - acme-cache (acme/cache:1.0)",
	}

	got := search.FuzzySearch(haystack, "acme", 0.7)

	if !reflect.DeepEqual(got, haystack) {
		t.Fatalf("FuzzySearch() = %v, want %v", got, haystack)
	}
}
