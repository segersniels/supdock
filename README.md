# Supdock

[![crates.io](https://img.shields.io/crates/v/supdock.svg)](https://crates.io/crates/supdock)
[![npm](https://img.shields.io/npm/v/supdock)](https://www.npmjs.com/package/supdock)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/segersniels/supdock/ci.yml)

What's Up, Doc(ker)? A convenient way to interact with the docker daemon. Supdock is a wrapper for the docker command meaning you can still use all of the other `docker` commands without issues.

<p align="center">
<img src="https://i.imgur.com/ATV0nP7.png" width="250">

## Why

Repetitive use of `docker ps`, `docker logs`, `docker stats` and `docker exec -ti` when troubleshooting complex container setups can get chaotic. Supdock aims to optimize and speed up your workflow using docker.

![img](./demo.gif)

## Installation

### Cargo

```bash
cargo install supdock
```

### NPM

```bash
npm install -g supdock
```

Chances are you will run into issues with `yarn` due to symlink issues, so install through npm instead.

### Binary

Grab a binary from the [releases](https://github.com/segersniels/supdock/releases) page and move it into your desired bin (eg. /usr/local/bin) location.

```bash
mv supdock-<os> /usr/local/bin/supdock
chmod +x /usr/local/bin/supdock
```

## Alias

If you don't want to use `supdock` and `docker` separately you can just set an alias.

```bash
alias docker="supdock"
```

## Usage

```
What's Up Doc(ker)?

Usage: supdock [COMMAND]

Commands:
  prune  Remove stopped containers and dangling images. For more detailed usage refer to "docker system prune -h"
  ssh    SSH into a container
  env    See the environment variables of a running container
  cat    Echo the contents of a file using cat on a container

Options:
  -h, --help  Print help

For more detailed usage on docker refer to "docker help"
```

Usage above can differ from the actual usage shown by the command.

## Changelog

For a basic changelog overview go [here](./CHANGELOG.md).
I try to keep track of most general changes as best as I can.

## Contributing & Troubleshooting

If you would like to see something added or you want to add something yourself feel free to create an issue or a pull request.
Please provide either the panic log or your terminal output with `RUST_LOG=debug` enabled for easier troubleshooting.
