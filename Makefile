.DEFAULT_GOAL := build

# Go related variables
BINARY_NAME=supdock
BINARY_PATH=./$(BINARY_NAME)
VERSION=4.0.0

# Build flags
LDFLAGS=-ldflags "-s -w -X main.version=$(VERSION)"

.PHONY: clean build dev lint lint-fix test version changelog demo install

clean:
	rm -f $(BINARY_NAME)
	go clean

build: clean
	go build $(LDFLAGS) -o $(BINARY_NAME) .

# Development build without cleanup
dev:
	go build -o $(BINARY_NAME) .

# Run with debug logging enabled
dev-debug: dev
	SUPDOCK_DEBUG=1 ./$(BINARY_NAME)

# Install locally
install: build
	sudo mv $(BINARY_NAME) /usr/local/bin/

# Lint and format
lint:
	go fmt ./...
	go vet ./...
	go mod tidy

lint-fix: lint

# Test the build
test: build
	./$(BINARY_NAME) --version
	./$(BINARY_NAME) --help

# Get version from source
version:
	@echo $(VERSION)

# Generate changelog (requires npx and gitmoji-changelog)
changelog:
	npx gitmoji-changelog

# Generate demo (requires vhs)
demo:
	@vhs demo.tape

# Cross-compilation targets
build-linux: clean
	GOOS=linux GOARCH=amd64 go build $(LDFLAGS) -o $(BINARY_NAME)-linux-amd64 .

build-darwin: clean
	GOOS=darwin GOARCH=amd64 go build $(LDFLAGS) -o $(BINARY_NAME)-darwin-amd64 .
	GOOS=darwin GOARCH=arm64 go build $(LDFLAGS) -o $(BINARY_NAME)-darwin-arm64 .

build-windows: clean
	GOOS=windows GOARCH=amd64 go build $(LDFLAGS) -o $(BINARY_NAME)-windows-amd64.exe .

build-all: build-linux build-darwin build-windows

# Release build with all platforms
release: build-all
	@echo "Built binaries for all platforms in current directory"