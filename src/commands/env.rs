use crate::utils::{command, exec, prompt};

/// Ease of use shortcut to log the environment variables of a running container
pub fn run(sub_matches: &clap::ArgMatches) {
    let mut args = vec!["exec".to_string(), "-ti".to_string()];
    let choice = if let Some((query, _)) = sub_matches.subcommand() {
        command::handle_fuzzy_search(query, "env")
    } else {
        prompt::prompt("Select a container from the list", "env")
    };

    args.extend(vec![choice, "env".to_string()]);

    exec::run_and_exit(&args);
}
