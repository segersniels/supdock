use std::{
    io::Error,
    process::{self, Command, Output, Stdio},
};

use crate::util;

/// Run a Docker command and only capture its error output
pub fn run_with_stderr_capture(args: &[String]) -> Result<Output, Error> {
    return Command::new(util::get_docker_binary_path())
        .args(args)
        .stdin(Stdio::inherit())
        .stdout(Stdio::inherit())
        .stderr(Stdio::piped())
        .output();
}

/// Run the command with inheritance and exit the process immediately after it completes
pub fn run_and_exit(args: &[String]) {
    let mut command = Command::new(util::get_docker_binary_path())
        .args(args)
        .spawn()
        .expect("failed to spawn command");

    process::exit(command.wait().unwrap().code().unwrap());
}

/// Execute a command in background disregarding any output
pub fn run_in_background(args: &[String]) {
    Command::new(util::get_docker_binary_path())
        .args(args)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("failed to spawn command");
}
