use log::debug;

use crate::utils::docker;
use std::{process, str::FromStr};

use super::command::{GetType, SupportedPromptCommand};

/// Parse the result and extract the container id from it
/// `8ee008c67aed - foo (nginx:1.19)` -> `8ee008c67aed`
pub fn extract_id_from_result(result: &str) -> String {
    result.split('-').next().unwrap().trim().to_owned()
}

/// Determine the choices for the prompt based on the requested alias
pub fn determine_choices(command: &str) -> Result<Vec<String>, String> {
    let prompt_command: SupportedPromptCommand = SupportedPromptCommand::from_str(command).unwrap();
    let docker_type = prompt_command.get_docker_type();

    let choices: Result<Vec<String>, String> = match docker_type {
        docker::Type::AllImages => docker::get_images(),
        _ => docker::get_containers(docker_type),
    };

    debug!("Choices: {:?}", choices);

    choices
}

/// Prompt the user to select a container
pub fn prompt(message: &str, command: &str) -> String {
    let options = determine_choices(command);

    match options {
        Ok(options) => {
            let selection = ask(message, &options);

            extract_id_from_result(&selection)
        }
        Err(error) => {
            eprintln!("{}", error);
            process::exit(0);
        }
    }
}

pub fn prompt_from_choices(message: &str, choices: &[String]) -> String {
    let selection = ask(message, choices);

    extract_id_from_result(&selection)
}

pub fn ask(message: &str, options: &[String]) -> String {
    let selection = inquire::Select::new(message, options.to_owned()).prompt();

    if selection.is_err() {
        process::exit(0)
    }

    selection.unwrap()
}

pub fn text(message: &str) -> String {
    inquire::Text::new(message).prompt().unwrap()
}
