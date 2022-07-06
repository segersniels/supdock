use wasm_bindgen::prelude::*;
mod search;

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
    let haystack = haystack.into_serde::<Vec<String>>()?;
    let results = search::search(haystack, needle, 0.7, " ");

    Ok(JsValue::from_serde(&results)?.into())
}
