use std::collections::HashSet;
use strsim::jaro_winkler;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: JsValue);
}

fn parse(needle: String) -> Vec<String> {
    let mut words: Vec<String> = needle
        .split_whitespace()
        .map(|token| token.to_string().to_lowercase())
        .collect();

    // Filter out empty
    words.retain(|word| !word.is_empty());

    // Deduplicate words, we don't benefit from matching duplicates
    words.dedup();

    return words;
}

pub fn search(haystack: Vec<String>, needle: String, threshold: f64) -> Vec<String> {
    let mut results = HashSet::new();

    for potential_needle in haystack.iter() {
        let words = parse(potential_needle.to_owned());

        for word in words {
            let distance = jaro_winkler(&word.to_lowercase(), &needle.to_lowercase());

            // Not similar enough
            if distance < threshold {
                continue;
            }

            // Found similarity that exceeds our threshold, stop looking
            results.insert(potential_needle.to_owned());
            break;
        }
    }

    return Vec::from_iter(results);
}
