#!/bin/bash

BIN_DIR="./bin"
BINARY="supdock"
PLATFORM=$(uname)

function check_if_binary_exists() {
    BINARY_PATH="$BIN_DIR/$PLATFORM_BINARY"

    if [ ! -f "$BINARY_PATH" ]; then
        echo "File ${BINARY_PATH} not found, skipping..."
        exit 0
    fi
}

function determine_platform() {
    case $PLATFORM in
    Linux)
        if [[ $(uname -m) == "aarch64" ]]; then
        PLATFORM_BINARY="supdock-aarch64-linux"
        else
        PLATFORM_BINARY="supdock-amd64-linux"
        fi
        ;;
    Darwin)
        PLATFORM_BINARY="supdock-macos"
        ;;
    *)
        echo "Unsupported platform: $PLATFORM"
        exit 0
        ;;
    esac

    check_if_binary_exists
}

function remove_other_binaries() {
    for file in "$BIN_DIR"/*; do
        if [ ! -f "$file" ]; then
            continue
        fi

        filename=$(basename "$file")

        if [[ ! "$filename" =~ ^$PLATFORM_BINARY ]]; then
            echo "Removing file: $file"
            rm "$file"
        fi
    done
}

function rename_binary() {
    mv $BINARY_PATH $BIN_DIR/$BINARY
}

function main() {
    determine_platform
    remove_other_binaries
    rename_binary
}

main
