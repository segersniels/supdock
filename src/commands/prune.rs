use std::env;

use crate::utils::exec;

/// Ease of use shortcut for `docker system prune`
pub fn run(sub_matches: &clap::ArgMatches) {
    // Log data that can be pruned
    if sub_matches.get_flag("info") {
        exec::run_and_exit(&["system".to_string(), "df".to_string()]);
    }

    let mut args = vec!["system".to_string(), "prune".to_string(), "-f".to_string()];
    let passthrough_args: Vec<_> = env::args().skip(2).collect();
    args.extend(passthrough_args);

    exec::run_and_exit(&args);
}
