#!/bin/sh
set -e

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to check if command exists
command_exists() {
  command -v "$@" > /dev/null 2>&1
}

# Function to check if global npm package exists
package_exists() {
  npm list -g --depth=0 | grep -q "$1"
}

do_install() {
  # Check that Docker is installed
  if ! command_exists docker; then
    echo "🚨 Docker is not installed. Please install Docker and try again."
    echo "See https://docs.docker.com/get-docker/ for instructions."
    exit 1
  fi

  # Check that Node.js is installed
  if ! command_exists node; then
    echo "🚨 Node.js is not installed. Please install Node.js and try again."
    # Automatic installation of Node.js
    if [ "$OS" != "windows" ]; then
      read -p "Do you want to install Node.js? [y/N] " -n 1 -r
      echo
      # Check if user wants to install Node.js
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$OS" = "mac" ]; then
          brew install node
        elif [ "$OS" = "linux" ]; then
          curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
          sudo apt-get install nodejs
        fi
      # Exit if user doesn't want to install Node.js
      else
        echo "🚨 Node.js is required to install this program."
        exit 1
      fi
    # Exit if Node.js is not installed on Windows
    else
      echo "See https://nodejs.org/en/download/"
      exit 1
    fi
  fi

  # Check that Yarn is installed
  if ! command_exists yarn; then
    echo "🚨 Yarn is not installed. Please install Yarn and try again."
    # Automatic installation of Yarn
    if [ "$OS" != "windows" ]; then
      read -p "Do you want to install Yarn? [y/N] " -n 1 -r
      echo
      # Check if user wants to install Yarn
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$OS" = "mac" ]; then
          brew install yarn
        elif [ "$OS" = "linux" ]; then
          curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
          echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
          sudo apt-get update && sudo apt-get install yarn
        fi
      # Exit if user doesn't want to install Yarn
      else
        echo "🚨 Yarn is required to install this program."
        exit 1
      fi
    # Exit if Yarn is not installed on Windows
    else
      echo "See https://yarnpkg.com/en/docs/install"
      exit 1
    fi
  fi

  # Check that zx is installed
  if ! package_exists zx; then
    echo "🚨 zx is not installed. Please install zx and try again."
    # Automatic installation of zx
    read -p "Do you want to install zx? [y/N] " -n 1 -r
    echo
    # Check if user wants to install zx
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      npm install -g zx
    # Exit if user doesn't want to install zx
    else
      echo "🚨 zx is required to install this program."
      exit 1
    fi
  fi

  source $SCRIPT_DIR/install-terry.sh
  source $SCRIPT_DIR/install-deps.sh
}

do_install
