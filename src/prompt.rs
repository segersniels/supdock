use crate::{
    command::{GetType, SupportedPromptCommand},
    docker, util,
};
use std::{process, str::FromStr};

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
            let selection = ask(message, options);

            util::extract_id_from_result(selection)
        }
        Err(error) => {
            println!("{}", error);
            process::exit(0);
        }
    }
}

pub fn ask(message: &str, options: Vec<String>) -> String {
    let selection = inquire::Select::new(message, options).prompt();

    if selection.is_err() {
        process::exit(0)
    }

    selection.unwrap()
}

pub fn text(message: &str) -> String {
    return inquire::Text::new(message).prompt().unwrap();
}
