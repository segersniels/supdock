use crate::utils::docker;
use std::{process, str::FromStr};

use super::{
    command::{GetType, SupportedPromptCommand},
    search,
};

/// Parse the result and extract the container id from it
/// `8ee008c67aed - foo (nginx:1.19)` -> `8ee008c67aed`
pub fn extract_id_from_result(result: String) -> String {
    return result.split('-').next().unwrap().trim().to_owned();
}

/// Determine the choices for the prompt based on the requested alias
pub fn determine_choices(command: &str) -> Result<Vec<String>, String> {
    let prompt_command = SupportedPromptCommand::from_str(command).unwrap();

    match prompt_command {
        SupportedPromptCommand::RemoveImage => docker::get_images(),
        _ => docker::get_containers(prompt_command.get_docker_type()),
    }
}

/// Prompt the user to select a container
pub fn prompt(message: &str, command: &str) -> String {
    let options = determine_choices(command);

    match options {
        Ok(options) => {
            let selection = ask(message, &options);

            extract_id_from_result(selection)
        }
        Err(error) => {
            println!("{}", error);
            process::exit(0);
        }
    }
}

pub fn ask(message: &str, options: &[String]) -> String {
    let selection = inquire::Select::new(message, options.to_owned()).prompt();

    if selection.is_err() {
        process::exit(0)
    }

    selection.unwrap()
}

pub fn text(message: &str) -> String {
    return inquire::Text::new(message).prompt().unwrap();
}

/// Determine the container (or image) based on the specified command
pub fn determine_choice(command: &str) -> String {
    let prompt_command = SupportedPromptCommand::from_str(command).unwrap();
    let choice = prompt(
        format!(
            "Select the desired {} from the list",
            prompt_command.get_prompt_type()
        )
        .as_str(),
        command,
    );

    choice
}

/// Search for a container (or image) based on the specified query and command
pub fn determine_choice_from_query(command: &str, query: &str) -> String {
    if query.is_empty() {
        return determine_choice(command);
    }

    let choices = determine_choices(command).unwrap_or_default();
    let results = search::search(choices, query, 0.7, " ");

    return match results.len() {
        0 => {
            // No results found, prompt the user to select a container
            let prompt_command = SupportedPromptCommand::from_str(command).unwrap();
            prompt(
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
            extract_id_from_result(results[0].clone())
        }
        _ => {
            // Multiple results returned, prompt user to select a container from the results
            extract_id_from_result(ask(
                "Search returned more than one result, please make a choice from the list.",
                &results,
            ))
        }
    };
}
