use std::process;

use crate::utils::{command::SupportedPromptCommand, exec, loader, openai, prompt};

async fn investigate(sub_matches: &clap::ArgMatches) {
    let mut loader = loader::create_loader("Investigating container for suspicious activity...");

    let command = SupportedPromptCommand::AiInvestigate.to_string();
    let choice = match sub_matches.subcommand() {
        Some((query, _)) => prompt::determine_choice_from_query(&command, query),
        _ => prompt::determine_choice(&command),
    };

    let mut args = vec!["logs".to_string(), choice];
    if let Some(lines) = sub_matches.get_one::<String>("lines") {
        args.push("--tail".to_string());
        args.push(lines.to_string());
    }

    let output = exec::run_with_stdout_capture(&args).unwrap();
    let logs = String::from_utf8_lossy(&output.stdout);

    let default_model = openai::DEFAULT_MODEL.to_string();
    let model = sub_matches
        .get_one::<String>("model")
        .unwrap_or(&default_model);

    match openai::analyze_logs(&logs, model).await {
        Ok(analysis) => {
            loader.stop_with_message("✅ Done\n".into());
            println!("{}", analysis);
        }
        Err(e) => {
            println!("{}", e);
            process::exit(1);
        }
    }
}

/// Run AI powered docker commands
pub async fn run(sub_matches: &clap::ArgMatches) {
    match sub_matches.subcommand() {
        Some(("investigate", sub_matches)) => investigate(sub_matches).await,
        _ => unreachable!(),
    }
}
