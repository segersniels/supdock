# Supdock
What's Up, Doc(ker)? A slightly more visual way to interact with the docker daemon. Supdock is a wrapper for the docker command meaning you can use all of the standard `docker` commands.

<p align="center">
<img src="https://i.imgur.com/ATV0nP7.png" width="250">

## Installation
```bash
gem install tty-prompt ; curl -o /usr/local/bin/supdock https://raw.githubusercontent.com/segersniels/supdock/master/supdock ; chmod +x /usr/local/bin/supdock
```

## Why
Repetitive use of `docker ps`, `docker ps -a`, `docker stop` and `docker rmi` when troubleshooting  complex container setups can get chaotic.
