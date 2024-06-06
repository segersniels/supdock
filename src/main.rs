use clap::{error::ErrorKind, Arg, ArgAction, Command};

mod commands;
mod utils;

fn cli() -> Command {
    Command::new(env!("CARGO_PKG_NAME"))
        .about("What's Up Doc(ker)?")
        .version(env!("CARGO_PKG_VERSION"))
        .subcommand_required(false)
        .arg_required_else_help(true)
        .allow_external_subcommands(true)
        .disable_help_subcommand(true)
        .after_help(r#"This only displays "supdock" specific commands. For more detailed usage on docker refer to "docker help""#)
        .subcommand(Command::new("prune")
            .about(r#"Remove stopped containers and dangling images. For more detailed usage refer to "docker system prune -h""#)
            .arg(
                Arg::new("info")
                    .short('i')
                    .long("info")
                    .help("Log additional information")
                    .action(ArgAction::SetTrue),
            ).arg(
                Arg::new("all")
                    .short('a')
                    .long("all")
                    .help("Remove all unused images not just dangling ones")
                    .action(ArgAction::SetTrue),
            ).arg(
                Arg::new("volumes")
                    .long("volumes")
                    .help("Prune volumes")
                    .action(ArgAction::SetTrue),
            ).arg_required_else_help(false),
        )
        .subcommand(Command::new("ssh")
            .about("SSH into a container")
            .arg_required_else_help(false),
        )
        .subcommand(Command::new("env")
            .about("See the environment variables of a running container")
            .allow_external_subcommands(true)
            .arg_required_else_help(false),
        )
        .subcommand(Command::new("cat")
            .about("Echo the contents of a file using cat on a container")
            .arg_required_else_help(false),
        )
}

fn main() {
    env_logger::init();
    let result = cli().try_get_matches();

    match result {
        Ok(matches) => match matches.subcommand() {
            Some(("prune", sub_matches)) => commands::prune::run(sub_matches),
            Some(("ssh", _sub_matches)) => commands::ssh::run(),
            Some(("env", sub_matches)) => commands::env::run(sub_matches),
            Some(("cat", _sub_matches)) => commands::cat::run(),
            _ => utils::command::handle_subcommand(Some(matches.subcommand().unwrap().0)),
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

            utils::command::handle_subcommand(None);
        }
    }
}
