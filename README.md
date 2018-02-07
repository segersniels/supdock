# Supdock
What's Up, Dock(er)? A slightly more visual way to interact with the docker daemon. Supdock is a wrapper for the docker command, written in Ruby, meaning you can still use all of the standard `docker` commands.

<p align="center">
<img src="https://i.imgur.com/ATV0nP7.png" width="250">

## Installation
```bash
gem install tty-prompt ; curl -o /usr/local/bin/supdock https://raw.githubusercontent.com/segersniels/supdock/master/supdock ; chmod +x /usr/local/bin/supdock
```

You might have to execute as `sudo` to install the gem.  
If you don't want to use `supdock` and `docker` separately you can just set an alias.

```bash
alias docker="supdock"
```

## Why
Repetitive use of `docker ps`, `docker ps -a`, `docker stop` and `docker rmi` when troubleshooting  complex container setups can get chaotic. Supdock aims to optimize and speed up your workflow using docker.

![](https://i.gyazo.com/c1e63cfff8edf9e7c47397b642e1ceaf.gif)

## Possible Issues
- `... can't find header files for ruby at /usr/.../ruby.h` when building native extensions.  

You may need to install ruby headers by installing `ruby-devel` on your machine.  
*Source: [`https://stackoverflow.com/a/4502672/9002446`](https://stackoverflow.com/a/4502672/9002446)*

## Contributing
If you would like to see something added or you want to add something yourself feel free to create an issue or a pull request.
