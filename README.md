# Supdock
[![CircleCI](https://circleci.com/gh/segersniels/supdock-ts.svg?style=svg)](https://circleci.com/gh/segersniels/supdock-ts)
[![npm](https://img.shields.io/npm/dm/supdock.svg)](https://www.npmjs.com/package/supdock)

>Under rework to Typescript. Check out the Golang version in the meantime: [https://github.com/segersniels/supdock](https://github.com/segersniels/supdock).

What's Up, Dock(er)? A slightly more visual way to interact with the docker daemon. Supdock is a wrapper for the docker command meaning you can still use all of the other `docker` commands without issues.

<p align="center">
<img src="https://i.imgur.com/ATV0nP7.png" width="250">

## Why
Repetitive use of `docker ps`, `docker logs`, `docker stats` and `docker exec -ti` when troubleshooting  complex container setups can get chaotic. Supdock aims to optimize and speed up your workflow using docker.

<p align="center">
<img src="https://i.imgur.com/moY077k.gif" width="450">

## Installation
### Binary
Grab a binary from the [releases](https://github.com/segersniels/supdock-ts/releases) page and move it into your desired bin (eg. /usr/local/bin) location.

```bash
mv index-<os> /usr/local/bin/supdock
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
Usage: supdock [options] [command]

Options:

  -V, --version      output the version number
  -f, --force
  -D, --debug
  -H, --host <list>
  -l, --log-level
  --config
  --no-stream
  -h, --help         output usage information

Commands:

  stop              Stop a running container
  start             Start a stopped container
  restart           Restart a running container
  logs              See the logs of a container
  rm                Remove a container
  rmi               Remove an image
  prune             Remove stopped containers and dangling images
  stats             See the stats of a container
  ssh               SSH into a container
  history           See the history of an image
  inspect           Inspect a container
  env               See the environment variables of a running container
  compose [action]  Bring up a docker-compose project
```

## Known Issues
- Passing flags to `supdock` (eg. `supdock rm -f foo`) when using one of the custom commands can result in an unknown option error.

This is because [`commander.js`](https://www.npmjs.com/package/commander) interferes and doesn't know the flag. So if you encounter a flag that throws you this error, feel free to post an issue so I can add it for you.

## Contributing
If you would like to see something added or you want to add something yourself feel free to create an issue or a pull request.
