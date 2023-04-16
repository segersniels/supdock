use clap::{error::ErrorKind, ArgAction, Command};

mod command;
mod docker;
mod exec;
mod prompt;
mod search;
mod util;

fn cli() -> Command {
    Command::new(env!("CARGO_PKG_NAME"))
        .about("What's Up Doc(ker)?")
        .version(env!("CARGO_PKG_VERSION"))
        .subcommand_required(false)
        .arg_required_else_help(true)
        .allow_external_subcommands(true)
        .disable_help_subcommand(true)
        .after_help(r#"For more detailed usage on docker refer to "docker help""#)
        .subcommand(command::create_subcommand(
            "prune",
            r#"Remove stopped containers and dangling images. For more detailed usage refer to "docker system prune -h""#,
            Some(vec![command::Arg {
                id: "info",
                short: 'i',
                long: "info",
                help: "Log additional information",
                action: ArgAction::SetTrue,
            }]),
        ))
        .subcommand(command::create_subcommand(
            "ssh",
            "SSH into a container",
            None,
        ))
        .subcommand(command::create_subcommand(
            "env",
            "See the environment variables of a running container",
            None,
        ))
        .subcommand(command::create_subcommand(
            "cat",
            "Echo the contents of a file using cat on a container",
            None,
        ))
}

fn main() {
    let result = cli().try_get_matches();

    match result {
        Ok(matches) => match matches.subcommand() {
            Some(("prune", sub_matches)) => command::prune(sub_matches),
            Some(("ssh", _sub_matches)) => command::ssh(),
            Some(("env", _sub_matches)) => command::env(),
            Some(("cat", _sub_matches)) => command::cat(),
            _ => command::handle_subcommand(Some(matches.subcommand().unwrap().0)),
        },
        Err(error) => {
            if [
                ErrorKind::DisplayHelp,
                ErrorKind::DisplayHelpOnMissingArgumentOrSubcommand,
                ErrorKind::DisplayVersion,
            ]
            .contains(&error.kind())
            {
                error.exit();
            }

            command::handle_subcommand(None);
        }
    }
}
