use crate::utils::{exec, prompt};

/// Ease of use shortcut to _SSH_ into a running container
pub fn run() {
    let mut args = vec!["exec".to_string(), "-ti".to_string()];

    let choice = prompt::prompt("Select a container from the list", "ssh");
    let shell = prompt::ask(
        "Which shell is the container using?",
        &["bash".to_string(), "ash".to_string()],
    );
    args.extend(vec![choice, shell]);

    exec::run_and_exit(&args);
}
