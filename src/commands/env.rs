use crate::utils::{exec, prompt};

/// Ease of use shortcut to log the environment variables of a running container
pub fn run() {
    let mut args = vec!["exec".to_string(), "-ti".to_string()];

    let choice = prompt::prompt("Select a container from the list", "env");
    args.extend(vec![choice, "env".to_string()]);

    exec::run_and_exit(&args);
}
