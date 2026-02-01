#!/bin/bash

# Setup script for Mac/Linux
# Creates image folders automatically

echo ""
echo "========================================"
echo "  Image Folder Setup Script"
echo "========================================"
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

# Run the setup script
node setup-images.js

echo ""
echo "Done!"
