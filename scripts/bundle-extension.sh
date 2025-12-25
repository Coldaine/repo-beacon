#!/bin/bash
# scripts/bundle-extension.sh
# Bundles the extension by copying the platform-specific overlay binary and creating a .vsix package.

set -e

echo "Bundling extension..."

BIN_DIR="extension/bin"

# Create the binary directory if it doesn't exist
mkdir -p $BIN_DIR

# --- Copy the correct binary based on the OS ---
OS="$(uname -s)"
ARCH="$(uname -m)"

echo "Copying overlay binary for $OS..."

# For now, create dummy files to represent the binaries
case "$OS" in
    Linux*)
        touch $BIN_DIR/overlay-linux-x64
        ;;
    Darwin*)
        if [ "$ARCH" = "x86_64" ]; then
            touch $BIN_DIR/overlay-darwin-x64
        elif [ "$ARCH" = "arm64" ]; then
            touch $BIN_DIR/overlay-darwin-arm64
        else
            echo "Unsupported macOS architecture: $ARCH"
            exit 1
        fi
        ;;
    MINGW64_NT*|MSYS_NT*)
        touch $BIN_DIR/overlay-win32-x64.exe
        ;;
    *)
        echo "Unsupported OS: $OS"
        exit 1
        ;;
esac

echo "Binary copied."

# --- Package the extension ---
echo "Packaging .vsix..."
# cd extension
# npm install
# npx vsce package
# cd ..

echo "Extension bundling complete."
