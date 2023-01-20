#!/bin/sh
set -e

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go one level up
cd $SCRIPT_DIR/..

do_install() {
  # Install dependencies
  echo "📂 Installing dependencies..."
  yarn

  # Install completion
  echo "✅️ Tarrasque App dependencies have been installed."
}

do_install
