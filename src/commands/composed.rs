use std::{collections::HashSet, env, ffi::OsStr, process, sync::Mutex};

use crate::utils::{docker, exec, prompt};
use log::debug;
use walkdir::WalkDir;

fn look_up_compose_files() -> HashSet<std::path::PathBuf> {
    let files = Mutex::new(HashSet::new());

    let path = env::current_dir().unwrap();
    let mut it = WalkDir::new(path).max_depth(5).into_iter();
    loop {
        let entry = match it.next() {
            None => break,
            Some(Err(err)) => {
                debug!("Error while walking directory: {:?}", err);
                continue;
            }
            Some(Ok(entry)) => entry,
        };

        let path = entry.path();
        if path.is_dir() && entry.file_name() == "node_modules" {
            it.skip_current_dir();
            continue;
        }

        if path.is_symlink() {
            continue;
        }

        if path.is_file() {
            if let Some(extension) = path.extension().and_then(OsStr::to_str) {
                match extension {
                    "yml" | "yaml" => {
                        let file_name: String = path.file_name().unwrap().to_string_lossy().into();
                        if file_name.starts_with("docker-compose") {
                            let mut files = files.lock().unwrap();
                            files.insert(path.to_path_buf());
                        }
                    }
                    _ => (),
                }
            }
        }
    }

    files.into_inner().unwrap()
}

fn up(matches: &clap::ArgMatches) {
    let files = look_up_compose_files();
    if files.is_empty() {
        eprintln!("No compose files found relative to the current directory");
        process::exit(0);
    }

    let mut choices: Vec<String> = files
        .into_iter()
        .map(|path| path.to_string_lossy().into())
        .collect::<Vec<_>>();
    choices.sort();

    let mut args = vec!["compose".to_string()];
    let choice = prompt::ask("Select a project from the list", &choices);
    args.extend(vec!["-f".to_string(), choice, "up".to_string()]);

    if matches.get_flag("detached") {
        args.push("-d".to_string());
    }

    exec::run_and_exit(&args);
}

fn down(matches: &clap::ArgMatches) {
    let projects = docker::get_running_compose_projects();

    let mut args = vec!["compose".to_string()];
    let choice = prompt::ask("Select a project from the list", &projects);
    args.extend(vec!["-f".to_string(), choice, "down".to_string()]);

    exec::run_and_exit(&args);
}

pub fn run(matches: &clap::ArgMatches) {
    let files = look_up_compose_files();
    if files.is_empty() {
        eprintln!("No compose files found relative to the current directory");
        process::exit(0);
    }

    let mut is_detached = false;
    match matches.subcommand() {
        Some(("up", sub_matches)) => up(sub_matches),
        Some(("down", sub_matches)) => down(sub_matches),
        _ => {
            unreachable!("Invalid subcommand");
        }
    };
}
