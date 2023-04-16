use clap::{Arg as ClapArg, Command as ClapCommand};
use std::{env, process, str::FromStr, thread};
use strum::VariantNames;
use strum_macros::{Display, EnumString, EnumVariantNames};

use crate::{docker, exec, prompt, search, util};

#[derive(Debug, EnumString, Display, EnumVariantNames)]
pub enum SupportedPromptCommand {
    #[strum(serialize = "start")]
    Start,
    #[strum(serialize = "restart")]
    Restart,
    #[strum(serialize = "stop")]
    Stop,
    #[strum(serialize = "rm")]
    Remove,
    #[strum(serialize = "rmi")]
    RemoveImage,
    #[strum(serialize = "cat")]
    Cat,
    #[strum(serialize = "env")]
    Env,
    #[strum(serialize = "ssh")]
    Ssh,
    #[strum(serialize = "logs")]
    Logs,
}

pub trait GetType {
    fn get_docker_type(&self) -> docker::Type;
    fn get_prompt_type(&self) -> String;
}

impl GetType for SupportedPromptCommand {
    /// Get internal Docker API type which controls what to ask from the remote API
    fn get_docker_type(&self) -> docker::Type {
        match self {
            SupportedPromptCommand::Start => docker::Type::StoppedContainers,
            SupportedPromptCommand::Restart => docker::Type::RunningContainers,
            SupportedPromptCommand::Stop => docker::Type::RunningContainers,
            SupportedPromptCommand::Remove => docker::Type::StoppedContainers,
            SupportedPromptCommand::RemoveImage => docker::Type::AllImages,
            SupportedPromptCommand::Cat => docker::Type::RunningContainers,
            SupportedPromptCommand::Env => docker::Type::RunningContainers,
            SupportedPromptCommand::Ssh => docker::Type::RunningContainers,
            SupportedPromptCommand::Logs => docker::Type::AllContainers,
        }
    }

    /// Get string representation to mention in the prompt questions
    fn get_prompt_type(&self) -> String {
        match self {
            SupportedPromptCommand::RemoveImage => "image",
            _ => "container",
        }
        .to_string()
    }
}

pub struct Arg {
    pub id: &'static str,
    pub short: char,
    pub long: &'static str,
    pub help: &'static str,
    pub action: clap::ArgAction,
}

pub fn create_subcommand(
    name: &'static str,
    about: &'static str,
    args: Option<Vec<Arg>>,
) -> clap::Command {
    let mut command = ClapCommand::new(name)
        .about(about)
        .arg_required_else_help(false);

    if let Some(args) = args {
        for arg in args {
            command = command.clone().arg(
                ClapArg::new(arg.id)
                    .action(arg.action)
                    .short(arg.short)
                    .long(arg.long)
                    .help(arg.help),
            );
        }
    }

    command
}

/// Perform parallel execution of requested command on all containers
pub fn parallel_execution(command: &str) {
    if !vec!["stop", "start", "restart"].contains(&command) {
        println!("Parallel execution is not supported for this command");
        process::exit(0);
    }

    let mut handles = Vec::new();
    let choices = prompt::determine_choices(command).unwrap();

    println!("Asynchronous execution of command is happening in the background");

    for choice in choices {
        let handle = thread::spawn(move || {
            let id = util::extract_id_from_result(choice);
            let args = util::get_args_from_env()
                .iter()
                .map(|s| s.replace("all", &id))
                .collect::<Vec<_>>();

            exec::run_in_background(args);
        });

        handles.push(handle);
    }

    // wait for all threads to finish
    for handle in handles {
        handle.join().unwrap();
    }

    println!(
        "Some containers might take longer than others to {}",
        command
    );

    process::exit(0);
}

/// Handle the subcommand and run the desired `docker` command with the user's choice of container
pub fn handle_subcommand(command: Option<&str>) {
    let args = util::get_args_from_env();

    // Only handle commands that need actual prompting, else just passthrough to docker itself
    let command = command.unwrap_or("");
    if command.is_empty() || !SupportedPromptCommand::VARIANTS.contains(&command) {
        return exec::run_and_exit(args);
    }

    // Forward the command to docker and see what we need to do with it
    let result = exec::run_with_stderr_capture(args);

    match result {
        Ok(output) => {
            let error_msg = String::from_utf8_lossy(&output.stderr);
            let status_code = output.status.code().unwrap();

            // If there's no error, then we can just assume the docker passthrough worked as intended
            if error_msg.is_empty() {
                process::exit(status_code);
            }

            /*
            Here's where the magic of supdock comes into play.
            We assume that if a user provided an id or name of a container that didn't match
            with the default behavior of `docker`, then they probably meant to fuzzy match it.

            Additionally we allow the user to pass in `all` as a query to perform a parallel execution.
             */
            if error_msg.contains("No such container") || error_msg.contains("No such image") {
                // Extract the query from the error message and trim it to remove any whitespace.
                let query =
                    util::extract_container_name_from_error(error_msg.as_ref()).unwrap_or("");

                // Parallel execution requested
                if query == "all" {
                    return parallel_execution(command);
                }

                // Construct haystack to prepare for fuzzy search
                let choices = prompt::determine_choices(command).unwrap_or(Vec::new());

                // Search within the haystack for the requested query by fuzzy searching
                let results = search::search(choices, query, 0.7, " ");
                let choice = match results.len() {
                    0 => {
                        // No results found, prompt the user to select a container
                        let prompt_command = SupportedPromptCommand::from_str(command).unwrap();
                        prompt::prompt(
                            format!(
                                "Select the desired {} from the list",
                                prompt_command.get_prompt_type()
                            )
                            .as_str(),
                            command,
                        )
                    }
                    1 => {
                        // Single result returned so assume it's the correct container
                        util::extract_id_from_result(results[0].clone())
                    }
                    _ => {
                        // Multiple results returned, prompt user to select a container from the results
                        util::extract_id_from_result(prompt::ask(
                            "Search returned more than one result, please make a choice from the list.",
                            results,
                        ))
                    }
                };

                return util::default_with_replace(query, choice.as_str());
            }

            // If the user didn't provide a query or id so we prompt them to select a container
            if error_msg.contains("requires exactly 1 argument")
                || error_msg.contains("requires at least 1 argument")
            {
                let prompt_command = SupportedPromptCommand::from_str(command).unwrap();
                let choice = prompt::prompt(
                    format!(
                        "Select the desired {} from the list",
                        prompt_command.get_prompt_type()
                    )
                    .as_str(),
                    command,
                );

                return util::default_with_choice(choice);
            }

            // We don't handle this error in supdock, pass it to the user and let them deal with it
            println!("{}", error_msg);
            process::exit(status_code);
        }
        Err(error) => {
            // Something went wrong trying the passthrough docker command
            println!("{}", error);
            process::exit(1);
        }
    }
}

/// Ease of use shortcut for `docker system prune`
pub fn prune(sub_matches: &clap::ArgMatches) {
    // Log data that can be pruned
    if sub_matches.get_flag("info") {
        exec::run_and_exit(
            vec!["system", "df"]
                .iter()
                .map(|s| s.to_owned().to_owned())
                .collect::<Vec<_>>(),
        );
    }

    let mut args = vec!["system", "prune", "-f"];
    let passthrough_args: Vec<_> = env::args().skip(2).collect();
    args.extend(passthrough_args.iter().map(|s| s.as_str()));

    exec::run_and_exit(args.iter().map(|&s| s.to_owned()).collect::<Vec<_>>());
}

/// Ease of use shortcut to _SSH_ into a running container
pub fn ssh() {
    let mut args = vec!["exec".to_string(), "-ti".to_string()];

    let choice = prompt::prompt("Select a container from the list", "ssh");
    let shell = prompt::ask(
        "Which shell is the container using?",
        vec!["bash".to_string(), "ash".to_string()],
    );

    args.extend(
        [choice, shell]
            .iter()
            .map(|s| s.to_owned())
            .collect::<Vec<_>>(),
    );

    exec::run_and_exit(args);
}

/// Ease of use shortcut to log the environment variables of a running container
pub fn env() {
    let mut args = vec!["exec".to_string(), "-ti".to_string()];
    let choice = prompt::prompt("Select a container from the list", "env");

    args.extend(
        [choice, "env".to_string()]
            .iter()
            .map(|s| s.to_owned())
            .collect::<Vec<_>>(),
    );

    exec::run_and_exit(args);
}

/// Ease of use shortcut to view the contents of a file within a running container
pub fn cat() {
    let mut args = vec!["exec".to_string(), "-ti".to_string()];

    let choice = prompt::prompt("Select a container from the list", "cat");
    let file = prompt::text("Which file would you like to cat?");

    args.extend(
        [choice, "cat".to_string(), file]
            .iter()
            .map(|s| s.to_owned())
            .collect::<Vec<_>>(),
    );

    exec::run_and_exit(args);
}
