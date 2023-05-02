use crate::utils::{exec, prompt};

/// Ease of use shortcut to view the contents of a file within a running container
pub fn run() {
    let mut args = vec!["exec".to_string(), "-ti".to_string()];

    let choice = prompt::prompt("Select a container from the list", "cat");
    let file = prompt::text("Which file would you like to cat?");
    args.extend(vec![choice, "cat".to_string(), file]);

    exec::run_and_exit(&args);
}
