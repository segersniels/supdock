use simsearch::{SearchOptions, SimSearch};

pub fn search(haystack: Vec<String>, needle: String, threshold: f64) -> Vec<String> {
    let mut engine: SimSearch<u32> = SimSearch::new_with(SearchOptions::new().threshold(threshold));

    // Insert the potential "needles" into the engine
    for (index, potential_needle) in haystack.iter().enumerate() {
        engine.insert(index.try_into().unwrap(), potential_needle);
    }

    // Perform the search
    let results: Vec<u32> = engine.search(&needle);
    let results = results
        .iter()
        .map(|index| haystack[index.to_owned() as usize].to_string())
        .collect::<Vec<_>>();

    return results;
}
