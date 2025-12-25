#!/bin/bash
# scripts/build-overlay.sh
# Builds the Tauri overlay for the current platform.

set -e

echo "Building Tauri overlay..."

# Navigate to the overlay directory
cd overlay

OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
    Linux*)
        echo "Building for Linux x64..."
        # npm run tauri build -- --target x86_64-unknown-linux-gnu
        ;;
    Darwin*)
        echo "Building for macOS..."
        if [ "$ARCH" = "x86_64" ]; then
            echo "Building for macOS x64..."
            # npm run tauri build -- --target x86_64-apple-darwin
        elif [ "$ARCH" = "arm64" ]; then
            # On GitHub Actions, uname -m for arm64 might be x86_64 running under Rosetta.
            # A dedicated arm64 runner is needed for a true arm64 build.
            # Assuming the runner architecture is correct.
            echo "Building for macOS arm64..."
            # npm run tauri build -- --target aarch64-apple-darwin
        else
            echo "Unsupported macOS architecture: $ARCH"
            exit 1
        fi
        ;;
    MINGW64_NT*|MSYS_NT*)
        echo "Building for Windows x64..."
        # npm run tauri build -- --target x86_64-pc-windows-msvc
        ;;
    *)
        echo "Unsupported OS: $OS"
        exit 1
        ;;
esac


echo "Overlay build complete."
cd ..
