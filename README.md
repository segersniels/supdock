# Supdock

[![CircleCI](https://circleci.com/gh/segersniels/supdock-ts.svg?style=svg)](https://circleci.com/gh/segersniels/supdock-ts)
[![npm](https://img.shields.io/npm/dm/supdock.svg)](https://www.npmjs.com/package/supdock)

> Rework to Typescript in progress. There might be inconsistencies and broken things popping up. Feel free to report these by making an issue. Feel free to temporarily use the Golang version of Supdock: [https://github.com/segersniels/supdock](https://github.com/segersniels/supdock).

What's Up, Dock(er)? A slightly more visual way to interact with the docker daemon. Supdock is a wrapper for the docker command meaning you can still use all of the other `docker` commands without issues.

<p align="center">
<img src="https://i.imgur.com/ATV0nP7.png" width="250">

## Why

Repetitive use of `docker ps`, `docker logs`, `docker stats` and `docker exec -ti` when troubleshooting complex container setups can get chaotic. Supdock aims to optimize and speed up your workflow using docker.

<p align="center">
<img src="https://i.imgur.com/moY077k.gif" width="450">

## Installation

### Binary

Grab a binary from the [releases](https://github.com/segersniels/supdock-ts/releases) page and move it into your desired bin (eg. /usr/local/bin) location.

```bash
mv supdock-<os> /usr/local/bin/supdock
chmod +x /usr/local/bin/supdock
```

### NPM

```bash
npm install -g supdock
```

If you don't want to use `supdock` and `docker` separately you can just set an alias.

```bash
alias docker="supdock"
```

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
  	help, h		Shows a list of commands or help for one command

  GLOBAL OPTIONS:
  	--help, -h	show help
  	--version, -v	print the version
```

## Contributing

If you would like to see something added or you want to add something yourself feel free to create an issue or a pull request.
