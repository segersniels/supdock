# Supdock
What's Up, Dock(er)? A slightly more visual way to interact with the docker daemon. Supdock is a wrapper for the docker command meaning you can still use all of the other `docker` commands without issues.

<p align="center">
<img src="https://i.imgur.com/ATV0nP7.png" width="250">

## Installation
```bash
npm install -g supdock
```

If you don't want to use `supdock` and `docker` separately you can just set an alias.

```bash
alias docker="supdock"
```

## Why
Repetitive use of `docker ps`, `docker logs`, `docker stop` and `docker rmi` when troubleshooting  complex container setups can get chaotic. Supdock aims to optimize and speed up your workflow using docker.

![](https://i.gyazo.com/c1e63cfff8edf9e7c47397b642e1ceaf.gif)

## Known issues
Passing flags to `supdock` (eg. `supdock rm -f foo`) when using one of the custom commands can result in an unknown option error. This is because [`commander.js`](https://www.npmjs.com/package/commander) interferes with it and doesn't know it. These custom flags have to be added to the tool manually. So if you encounter a flag you wish to use, feel free to post an issue so I can add it.

I currently have these basic flags added:  
```bash
    -V, --version      output the version number
    -f, --force        
    -D, --debug        
    -H, --host <list>  
    -l, --log-level    
    --config           
    --no-stream        
    -h, --help         output usage information
```

## Contributing
If you would like to see something added or you want to add something yourself feel free to create an issue or a pull request.
