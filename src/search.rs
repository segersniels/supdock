use std::collections::HashSet;
use strsim::jaro_winkler;

fn parse(needle: &str, split_char: &str) -> Vec<String> {
    let mut words = needle
        .split(split_char)
        .map(|token| token.to_lowercase())
        .collect::<Vec<_>>();

    // Filter out empty
    words.retain(|word| !word.is_empty());

    // Deduplicate words, we don't benefit from matching duplicates
    words.sort();
    words.dedup();

    words
}

fn is_similar(word: &str, needle: &str, threshold: f64) -> bool {
    let distance = jaro_winkler(&word.to_lowercase(), &needle.to_lowercase());
    distance > threshold
}

/// Search for a needle in a haystack
pub fn search(
    haystack: Vec<String>,
    needle: &str,
    threshold: f64,
    split_char: &str,
) -> Vec<String> {
    let mut results = HashSet::new();

    // Look for similarity in each of the options
    for potential_needle in haystack.iter().map(|item| item.as_str()) {
        let words = parse(potential_needle, split_char);

        // Crawl word by word to see if we can find similarity
        for word in words {
            // Similarity already found, stop looking
            if is_similar(word.as_str(), needle, threshold) {
                results.insert(potential_needle.to_owned());
                break;
            }

            if !word.contains('-') {
                continue;
            }

            // Check for similarity split by dashes in case of name (eg. this-is-my-container-name)
            if search(vec![word], needle, threshold, "-").is_empty() {
                continue;
            }

            // Found similarity after splitting by dashes, stop looking
            results.insert(potential_needle.to_owned());
            break;
        }
    }

    Vec::from_iter(results)
}
