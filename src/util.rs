use std::env;
use which::which;

use crate::exec;

/// Parse the result and extract the container id from it
/// `8ee008c67aed - foo (nginx:1.19)` -> `8ee008c67aed`
pub fn extract_id_from_result(result: String) -> String {
    return result.split('-').next().unwrap().trim().to_owned();
}

/// Get all passed command line arguments excl. the binary itself
pub fn get_args_from_env() -> Vec<String> {
    env::args().skip(1).collect::<Vec<_>>()
}

/// Passthrough to `docker` but replace a passed argument
pub fn default_with_replace(target: &str, value: &str) {
    let args = get_args_from_env()
        .iter()
        .map(|s| s.replace(target, value))
        .collect::<Vec<_>>();

    exec::run_and_exit(&args);
}

/// Passthrough to `docker` but append the requested argument
pub fn default_with_choice(choice: String) {
    let mut args = get_args_from_env();
    args.push(choice);

    exec::run_and_exit(&args);
}

pub fn get_docker_binary_path() -> String {
    match which("docker") {
        Ok(path) => path.to_str().unwrap().to_string(),
        Err(_) => panic!("Could not find docker binary"),
    }
}

pub fn extract_container_name_from_error(error: &str) -> Option<&str> {
    if let Some(index) = error.rfind(':') {
        let container_name = &error[index + 1..].trim();
        if !container_name.is_empty() {
            return Some(container_name);
        }
    }
    None
}
