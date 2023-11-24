use std::{collections::HashSet, slice};
use strsim::jaro_winkler;

/// Parse a needle string into a vector of lowercase words, filtered for empty strings and duplicates.
fn parse(needle: &str, split_char: &str) -> Vec<String> {
    let words = needle
        .split(split_char)
        .map(str::to_lowercase)
        .filter(|word| !word.is_empty())
        .collect::<Vec<_>>();

    let mut unique_words = HashSet::new();
    unique_words.extend(words);

    unique_words.into_iter().collect()
}

/// Determine if two strings are similar based on Jaro-Winkler distance.
fn is_similar(word: &str, needle: &str, threshold: f64) -> bool {
    let distance = jaro_winkler(&word.to_lowercase(), &needle.to_lowercase());

    distance > threshold
}

/// Search for a needle in a haystack
pub fn search<T, I>(haystack: I, needle: &str, threshold: f64, split_char: &str) -> Vec<String>
where
    T: AsRef<str>,
    I: IntoIterator<Item = T>,
{
    let mut results = HashSet::new();

    // Look for similarity in each of the options
    for potential_needle in haystack.into_iter() {
        let words = parse(potential_needle.as_ref(), split_char);

        // Crawl word by word to see if we can find similarity
        for word in &words {
            // Similarity already found, stop looking
            if is_similar(word, needle, threshold) {
                results.insert(potential_needle.as_ref().to_owned());
                break;
            }

            if !word.contains('-') {
                continue;
            }

            // Check for similarity split by dashes in case of name (eg. this-is-my-container-name)
            if search(slice::from_ref(word), needle, threshold, "-").is_empty() {
                continue;
            }

            // Found similarity after splitting by dashes, stop looking
            results.insert(potential_needle.as_ref().to_owned());
            break;
        }
    }

    results.into_iter().collect()
}
