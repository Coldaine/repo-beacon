#!/bin/bash
# scripts/clean.sh
# Removes all build artifacts.

set -e

echo "Cleaning build artifacts..."

# Remove extension binaries
rm -rf extension/bin

# Remove extension node_modules and build output
rm -rf extension/node_modules
rm -rf extension/dist
rm -f extension/*.vsix

# Remove overlay build artifacts
rm -rf overlay/src-tauri/target
rm -rf overlay/node_modules

# Remove top-level node_modules
rm -rf node_modules

echo "Clean complete."
