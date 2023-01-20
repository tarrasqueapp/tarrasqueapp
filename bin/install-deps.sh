#!/bin/bash
set -e

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go one level up
cd $SCRIPT_DIR/..

do_install() {
   # Install dependencies
  echo "📂 Installing development dependencies..."
  pnpm install

  echo "📂 Installing ui dependencies..."
  pnpm ui install

  echo "📂 Installing api dependencies..."
  pnpm api install

  # Install completion
  echo "✅️ Tarrasque App dependencies have been installed."
}

do_install
