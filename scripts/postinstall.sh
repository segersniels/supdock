#!/bin/bash

BIN_DIR="./bin"
BINARY="supdock"
PLATFORM=$(uname)

function check_if_binary_exists() {
    binary_path="$BIN_DIR/$1"

    if [ ! -f "$binary_path" ]; then
        echo "File ${binary_path} not found, skipping..."
        exit 0
    fi
}

function determine_platform() {
    case $PLATFORM in
    Linux)
        if [[ $(uname -m) == "aarch64" ]]; then
        platform_binary="supdock-aarch64-linux"
        else
        platform_binary="supdock-amd64-linux"
        fi
        ;;
    Darwin)
        platform_binary="supdock-macos"
        ;;
    *)
        echo "Unsupported platform: $PLATFORM"
        exit 0
        ;;
    esac

    check_if_binary_exists $platform_binary

    return $platform_binary
}

function remove_other_binaries() {
    for file in "$BIN_DIR"/*; do
        if [ ! -f "$file" ]; then
            continue
        fi

        filename=$(basename "$file")

        if [[ ! "$filename" =~ ^$1 ]]; then
            echo "Removing file: $file"
            rm "$file"
        fi
    done
}

function rename_binary() {
    binary_path="$BIN_DIR/$1"

    mv $binary_path $BIN_DIR/$BINARY
}

function main() {
    determine_platform
    platform_binary=$?

    remove_other_binaries $platform_binary
    rename_binary $platform_binary
}

main
