use crate::utils::{docker, exec};
use log::debug;
use std::{
    env,
    io::Error,
    process::{self, Command, Output, Stdio},
};

/// Run a Docker command and capture stderr and stdout
pub fn run_with_capture(args: &[String]) -> Result<Output, Error> {
    debug!("Executing: docker {}", args.join(" "));

    Command::new(docker::get_docker_binary_path())
        .args(args)
        .stdin(Stdio::inherit())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
}

/// Run the command with inheritance and exit the process immediately after it completes
pub fn run_and_exit(args: &[String]) {
    debug!("Executing: docker {}", args.join(" "));

    let mut command = Command::new(docker::get_docker_binary_path())
        .args(args)
        .spawn()
        .expect("failed to spawn command");

    process::exit(command.wait().unwrap().code().unwrap());
}

/// Execute a command in background disregarding any output
pub fn run_in_background(args: &[String]) {
    debug!("Executing: docker {}", args.join(" "));

    Command::new(docker::get_docker_binary_path())
        .args(args)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("failed to spawn command");
}

/// Get all passed command line arguments excl. the binary itself
pub fn get_args_from_env() -> Vec<String> {
    env::args().skip(1).collect::<Vec<_>>()
}

/// Passthrough to `docker` but replace a passed argument
pub fn default_with_replace(target: &str, value: &str) {
    debug!("Replacing {} with {}", target, value);

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
