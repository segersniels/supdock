# Supdock
What's Up, Dock(er)? A slightly more visual way to interact with the docker daemon. Supdock is a wrapper for the docker command meaning you can still use all of the standard `docker` commands.

<p align="center">
<img src="https://i.imgur.com/ATV0nP7.png" width="250">

## Installation
```bash
gem install tty-prompt ; curl -o /usr/local/bin/supdock https://raw.githubusercontent.com/segersniels/supdock/master/supdock ; chmod +x /usr/local/bin/supdock
```

You might have to execute as `sudo` to install the gem.

## Why
Repetitive use of `docker ps`, `docker ps -a`, `docker stop` and `docker rmi` when troubleshooting  complex container setups can get chaotic.

![](https://i.gyazo.com/c1e63cfff8edf9e7c47397b642e1ceaf.gif)
