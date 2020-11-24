# Supdock

[![Actions](https://action-badges.now.sh/segersniels/supdock)](https://github.com/segersniels/supdock/actions)[![npm](https://img.shields.io/npm/dm/supdock.svg)](https://www.npmjs.com/package/supdock)

What's Up, Dock(er)? A slightly more visual way to interact with the docker daemon. Supdock is a wrapper for the docker command meaning you can still use all of the other `docker` commands without issues.

<p align="center">
<img src="https://i.imgur.com/ATV0nP7.png" width="250">

## Why

Repetitive use of `docker ps`, `docker logs`, `docker stats` and `docker exec -ti` when troubleshooting complex container setups can get chaotic. Supdock aims to optimize and speed up your workflow using docker.

<p align="center">
<img src="https://i.imgur.com/moY077k.gif" width="450">

## Alias

If you don't want to use `supdock` and `docker` separately you can just set an alias.

```bash
alias docker="supdock"
```

## Installation

### NPM

```bash
npm install -g supdock
yarn global add supdock
```

### Binary

Grab a binary from the [releases](https://github.com/segersniels/supdock-ts/releases) page and move it into your desired bin (eg. /usr/local/bin) location.

```bash
mv supdock-<os> /usr/local/bin/supdock
chmod +x /usr/local/bin/supdock
```

## Changelog

For a basic changelog overview go [here](./CHANGELOG.md).
I try to keep track of most general changes as best as I can.

## Usage

```
  NAME:
  	supdock - What's Up Dock(er)?

  USAGE:
  	supdock [global options] command [command options] [arguments...]

  VERSION:
  	...

  COMMANDS:
  	logs		See the logs of a container
  	restart		Restart a running container
  	start		Start a stopped container
  	stop		Stop a running container
  	ssh		SSH into a container
  	env		See the environment variables of a running container
  	rm		Remove a container
  	rmi		Remove an image
  	history		See the history of an image
  	stats		See the stats of a container
  	inspect		Inspect a container
  	prune		Remove stopped containers and dangling images. For more detailed usage refer to 'docker system prune -h'
  	enable		Enable certain supdock functionality
  	disable		Disable certain supdock functionality
    ...
  	help, h		Shows a list of commands or help for one command

  GLOBAL OPTIONS:
  	--help, -h	show help
  	--version, -v	print the version
```

Usage above can differ from the actual usage shown by the command.

### Configuration

As of version `2.2.0` I introduced the option to fuzzy search by name for certain commands. Since this would overwrite the default docker behaviour that was intended to always passthrough, I added an option to enable or disable this functionality. Let me explain with an example.

In the normal `supdock` behaviour I originally intended commands like `supdock logs -f` to show a prompt with available options when no id or container name was passed. So when a user passed `supdock logs -f foobar` it would break the custom functionality and passthrough straight to `docker`. This made sure `supdock` wasn't too much of a drastic change to the default docker behaviour.

So coming back to the new fuzzy search. With fuzzy searching enabled you can now search based on a part of the container name like the following: `docker logs -f foo`. Which then matches your search term `foo` with the container named `foobar`. In the versions pre `2.2.0` of `supdock` it would just passthrough to docker and tell you the `foo` container didn't exist. This behaviour is disabled by default and can be enabled by doing the following: `supdock enable fuzzy-search`. And can ofcourse be disabled by using `supdock disable fuzzy-search`.

```
Usage:	supdock enable [OPTIONS]

  Enable certain supdock functionality

Options:
    caution-check  (When fuzzy searching is enabled we ask the user for confirmation before we execute the command. Default: enabled)
    fuzzy-search  (Disable fuzzy searching. Default: disabled)
```

The config file is created at `${HOME}/.supdock/config.json`.

#### Docker binary path

Supdock attempts to determine where the docker binary is located on your system. In some edge cases supdock fails to determine the path and falls back to just `docker` which should normally work in remaining cases. But if you have a special use case where you need to explicitly define the docker path you can do so by changing/adding the supdock config file. Add the `binary-path` config option like so:

```json
{
  "binary-path": "/path/to/docker"
}
```

## Contributing

If you would like to see something added or you want to add something yourself feel free to create an issue or a pull request.
