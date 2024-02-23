use std::{
    collections::HashSet,
    slice,
    sync::{Arc, Mutex},
    thread,
};
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
pub fn search(haystack: &[String], needle: &str, threshold: f64, split_char: &str) -> Vec<String> {
    let mut threads = Vec::new();
    let results = Arc::new(Mutex::new(HashSet::new()));

    for potential_needle in haystack.iter() {
        let results = Arc::clone(&results);
        let potential_needle = potential_needle.to_owned();
        let needle = needle.to_owned();
        let split_char = split_char.to_owned();

        threads.push(thread::spawn(move || {
            let words = parse(&potential_needle, &split_char);

            // Crawl word by word to see if we can find similarity
            for word in words {
                let mut results = results.lock().unwrap();

                // Similarity already found, stop looking
                if is_similar(&word, &needle, threshold) {
                    results.insert(potential_needle);
                    break;
                }

                if !word.contains('-') {
                    continue;
                }

                // Check for similarity split by dashes in case of name (eg. this-is-my-container-name)
                if search(slice::from_ref(&word), &needle, threshold, "-").is_empty() {
                    continue;
                }

                // Found similarity after splitting by dashes, stop looking
                results.insert(potential_needle);
                break;
            }
        }));
    }

    // Wait for threads to complete
    for thread in threads {
        thread.join().unwrap();
    }

    let result = results.lock().unwrap();
    result.iter().cloned().collect()
}
