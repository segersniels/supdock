.DEFAULT_GOAL := build

# Go related variables
BINARY_NAME=supdock
VERSION=4.1.0

# Build flags
LDFLAGS=-ldflags "-s -w -X github.com/segersniels/supdock/cmd.Version=$(VERSION)"

.PHONY: clean build build-release dev format lint lint-fix test version changelog demo install

clean:
	rm -f $(BINARY_NAME)
	go clean

build: clean
	$(MAKE) build-release OUTPUT=$(BINARY_NAME)

build-release:
	go build $(LDFLAGS) -o $(or $(OUTPUT),$(BINARY_NAME)) .

# Development build without cleanup
dev:
	go build -o $(BINARY_NAME) .

# Run with debug logging enabled
dev-debug: dev
	DEBUG=1 ./$(BINARY_NAME)

# Install locally
install: build
	sudo mv $(BINARY_NAME) /usr/local/bin/

# Format and lint
format:
	gofmt -w .

lint:
	@test -z "$$(gofmt -l .)" || (gofmt -l .; exit 1)
	go vet ./...

lint-fix: format
	go vet ./...

# Test the build
test: build
	go test ./...
	node --test
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
	GOOS=linux GOARCH=amd64 $(MAKE) build-release OUTPUT=$(BINARY_NAME)-linux-amd64
	GOOS=linux GOARCH=arm64 $(MAKE) build-release OUTPUT=$(BINARY_NAME)-linux-arm64

build-darwin: clean
	GOOS=darwin GOARCH=amd64 $(MAKE) build-release OUTPUT=$(BINARY_NAME)-darwin-amd64
	GOOS=darwin GOARCH=arm64 $(MAKE) build-release OUTPUT=$(BINARY_NAME)-darwin-arm64

build-windows: clean
	GOOS=windows GOARCH=amd64 $(MAKE) build-release OUTPUT=$(BINARY_NAME)-windows-amd64.exe

build-all: build-linux build-darwin build-windows

# Release build with all platforms
release: build-all
	@echo "Built binaries for all platforms in current directory"
