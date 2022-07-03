use simsearch::{SimSearch, SearchOptions};
use wasm_bindgen::prelude::*;

extern crate wee_alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(typescript_custom_section)]
const SEARCH_RESULT: &'static str = r#"
type SearchResults = string[];
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "SearchResults")]
    pub type SearchResults;
}

#[wasm_bindgen]
pub fn fuzzy(haystack: JsValue, needle: &str) -> Result<SearchResults, JsError> {
    // Create search engine
    let mut engine: SimSearch<u32> = SimSearch::new_with(SearchOptions::new().threshold(0.7));

    // Prepare the haystack by converting to workable strings
    let haystack = haystack.into_serde::<Vec<String>>()?;

    // Insert the potential "needles" into the engine
    for (index, potential_needle) in haystack.iter().enumerate() {
        engine.insert(index.try_into().unwrap(), potential_needle);
    }

    // Perform the search
    let results: Vec<u32> = engine.search(needle);
    let results = results
        .iter()
        .map(|index| haystack[index.to_owned() as usize].to_string())
        .collect::<Vec<_>>();

    Ok(JsValue::from_serde(&results)?.into())
}
