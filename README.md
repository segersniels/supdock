# Supdock

[![Go Report Card](https://goreportcard.com/badge/github.com/segersniels/supdock)](https://goreportcard.com/report/github.com/segersniels/supdock)
[![GitHub release](https://img.shields.io/github/release/segersniels/supdock.svg)](https://github.com/segersniels/supdock/releases)

What's Up, Doc(ker)? A beautiful way to interact with the Docker daemon. Supdock is a wrapper for the Docker command built with [Charmbracelet](https://charm.sh) libraries, meaning you can still use all of the other `docker` commands without issues.

<p align="center">
<img src="https://i.imgur.com/ATV0nP7.png" width="250" />
</p>

## ✨ Features

- **🎨 Beautiful TUI**: Built with Charmbracelet's Huh and Lipgloss for stunning terminal interfaces
- **⚡ Fast & Responsive**: Written in Go with concurrent operations and efficient Docker API integration
- **🔍 Smart Search**: Fuzzy search containers and images with goroutine-powered parallel matching
- **🐳 Full Docker Compatibility**: All standard Docker commands pass through seamlessly
- **🛠 Enhanced Commands**: Interactive prompts for common Docker operations
- **🎯 Error Recovery**: Smart error handling with helpful suggestions and container selection

## Why Rewrite?

The original Rust version was great, but Go brings several advantages:
- **Faster compilation** during development
- **Better Docker ecosystem integration** with the official Docker SDK
- **Stunning terminal UIs** with Charmbracelet libraries
- **Simpler concurrency** with goroutines
- **Single binary distribution** without external dependencies

## Installation

### Go Install
```bash
go install github.com/segersniels/supdock@latest
```

### Binary
Grab a binary from the [releases](https://github.com/segersniels/supdock/releases) page and move it into your desired bin (eg. /usr/local/bin) location.

```bash
# Download and install (replace with actual download URL)
curl -L https://github.com/segersniels/supdock/releases/latest/download/supdock-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m) -o supdock
chmod +x supdock
sudo mv supdock /usr/local/bin/
```

### Build from Source
```bash
git clone https://github.com/segersniels/supdock
cd supdock
make build
sudo make install
```

## Alias

If you don't want to use `supdock` and `docker` separately you can just set an alias.

```bash
alias docker="supdock"
```

## Usage

```bash
What's Up Doc(ker)?

Usage:
  supdock [COMMAND]

Commands:
  ssh     SSH into a container with beautiful shell selection
  env     See environment variables with optional fuzzy search  
  cat     View file contents within containers
  prune   Clean up containers and images with advanced options

Options:
  -h, --help     Show this help
  -v, --version  Show version

For more detailed usage on docker refer to "docker help"
```

### Enhanced Commands

#### SSH into Containers
```bash
supdock ssh
# Interactive selection with beautiful TUI
# Supports multiple shell types (bash, ash, sh)
```

#### Environment Variables  
```bash
supdock env                    # Interactive container selection
supdock env nginx             # Fuzzy search for containers matching "nginx"
supdock env web-server        # Smart matching for hyphenated names
```

#### File Contents
```bash
supdock cat
# Select container and specify file path interactively
```

#### System Cleanup
```bash
supdock prune                 # Basic cleanup with confirmation
supdock prune --info          # Show disk usage before cleanup  
supdock prune --all           # Remove all unused images
supdock prune --volumes       # Include volumes in cleanup
```

### Smart Passthrough

All Docker commands work seamlessly with enhanced error handling:

```bash
supdock ps                    # Lists containers
supdock logs web-server       # Shows logs, with fuzzy matching if not found
supdock stop all             # Parallel execution on all running containers
supdock start nginx          # Fuzzy matches and starts containers
```

## Advanced Features

### Fuzzy Search
Supdock uses intelligent fuzzy search to match container names:
- Direct substring matching
- Hyphenated name support (`web-server` matches `my-web-server-prod`) 
- Parallel search with goroutines for fast results

### Parallel Execution
Execute commands on multiple containers simultaneously:
```bash
supdock stop all      # Stops all running containers in parallel
supdock start all     # Starts all stopped containers in parallel  
supdock restart all   # Restarts all containers in parallel
```

### Debug Mode
Enable debug logging to see what's happening under the hood:
```bash
SUPDOCK_DEBUG=1 supdock ssh
```

## Development

### Requirements
- Go 1.21 or later
- Docker (for testing)

### Building
```bash
make build          # Build for current platform
make build-all      # Cross-compile for all platforms
make dev            # Development build
make dev-debug      # Development build with debug logging
```

### Testing  
```bash
make test           # Run build and basic tests
make lint           # Run formatters and linters
```

## Architecture

- **CLI Framework**: [Cobra](https://cobra.dev) for robust command handling
- **TUI Components**: [Charmbracelet Huh](https://github.com/charmbracelet/huh) for interactive prompts
- **Styling**: [Lipgloss](https://github.com/charmbracelet/lipgloss) for beautiful terminal styling
- **Docker Integration**: Official [Docker SDK](https://pkg.go.dev/github.com/docker/docker) for reliable API communication
- **Fuzzy Search**: [fuzzysearch](https://github.com/lithammer/fuzzysearch) with custom goroutine-powered matching

## Changelog

For a detailed changelog see [CHANGELOG.md](./CHANGELOG.md).

## Contributing & Troubleshooting

If you would like to see something added or want to add something yourself, feel free to create an issue or pull request.

For troubleshooting, enable debug logging:
```bash
SUPDOCK_DEBUG=1 supdock [command]
```

## License

MIT - see [LICENSE](./LICENSE) for details.