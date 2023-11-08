use clap::{error::ErrorKind, Arg, ArgAction, Command};
use utils::openai::ALLOWED_MODELS;

mod commands;
mod utils;

fn cli() -> Command {
    let ai = Command::new("ai")
        .about("Run AI powered commands")
        .arg_required_else_help(true)
        .subcommand(
            Command::new("investigate")
                .about("Investigate a container for suspicious activity")
                .allow_external_subcommands(true)
                .arg(
                    Arg::new("lines")
                        .short('l')
                        .long("lines")
                        .help("Number of lines to include from the end of the logs")
                        .action(ArgAction::Set),
                )
                .arg(
                    clap::Arg::new("model")
                        .short('m')
                        .long("model")
                        .help("Instructs supdock to use a specific model")
                        .value_parser(ALLOWED_MODELS)
                        .action(ArgAction::Set),
                ),
        );

    Command::new(env!("CARGO_PKG_NAME"))
        .about("What's Up Doc(ker)?")
        .version(env!("CARGO_PKG_VERSION"))
        .subcommand_required(false)
        .arg_required_else_help(true)
        .allow_external_subcommands(true)
        .disable_help_subcommand(true)
        .after_help(r#"For more detailed usage on docker refer to "docker help""#)
        .subcommand(Command::new("prune")
            .about(r#"Remove stopped containers and dangling images. For more detailed usage refer to "docker system prune -h""#)
            .arg(Arg::new("info").short('i').long("info").help("Log additional information").action(ArgAction::SetTrue))
            .arg(Arg::new("all").short('a').long("all").help("Remove all unused images not just dangling ones").action(ArgAction::SetTrue))
            .arg(Arg::new("volumes").long("volumes").help("Prune volumes").action(ArgAction::SetTrue))
        )
        .subcommand(Command::new(
            "ssh").about("SSH into a container")
        )
        .subcommand(Command::new(
            "env").about("See the environment variables of a running container")
        )
        .subcommand(Command::new(
            "cat").about("Echo the contents of a file using cat on a container")
        )
        .subcommand(ai)
}

#[tokio::main]
async fn main() {
    let result = cli().try_get_matches();

    match result {
        Ok(matches) => match matches.subcommand() {
            Some(("prune", sub_matches)) => commands::prune::run(sub_matches),
            Some(("ssh", _sub_matches)) => commands::ssh::run(),
            Some(("env", _sub_matches)) => commands::env::run(),
            Some(("cat", _sub_matches)) => commands::cat::run(),
            Some(("ai", sub_matches)) => commands::ai::run(sub_matches).await,
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
