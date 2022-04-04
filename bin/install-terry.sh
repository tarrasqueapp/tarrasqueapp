#!/bin/sh
set -e

GIT_REPO="https://github.com/tarrasqueapp/terry-cli.git"

# Function to check if command exists
command_exists() {
  command -v "$@" > /dev/null 2>&1
}

do_install() {
  # Check that Git is installed
  if ! command_exists git; then
    echo "🚨 Git is not installed. Please install Git and try again."
    exit 1
  fi

  # Check that Node.js is installed
  if ! command_exists node; then
    echo "🚨 Node.js is not installed. Please install Node.js and try again."
    echo "See https://nodejs.org/en/download/"
    exit 1
  fi

  # Check that Yarn is installed
  if ! command_exists yarn; then
    echo "🚨 Yarn is not installed. Please install Yarn and try again."
    echo "See https://yarnpkg.com/en/docs/install"
    exit 1
  fi

  # Check that zx is installed
  if ! command_exists zx; then
    echo "🚨 zx is not installed. Please install zx and try again."
    echo "npm install --global zx"
  fi

  # Check that Terry is not already installed
  if [ -d "$HOME/.terry" ]; then
    echo "🚨 Terry is already installed. Please remove ~/.terry and try again."
    exit 1
  fi

  # Clone the repository
  echo "📂 Cloning Terry CLI..."
  git clone $GIT_REPO ~/.terry

  # Install dependencies
  echo "📂 Installing dependencies..."
  cd ~/.terry
  yarn

  # Detect profile file
  if [ -f "$HOME/.bash_profile" ]; then
    PROFILE_FILE="$HOME/.bash_profile"
  elif [ -f "$HOME/.bashrc" ]; then
    PROFILE_FILE="$HOME/.bashrc"
  elif [ -f "$HOME/.zshrc" ]; then
    PROFILE_FILE="$HOME/.zshrc"
  else
    echo "🚨 Unable to find a profile file. Please add the following to your profile:"
    echo "  alias terry=$HOME/.terry/src/index.mjs"
    exit 1
  fi

  # Check that the profile file exists
  if [ ! -f "$PROFILE_FILE" ]; then
    echo "🚨 Unable to find a profile file. Please add the following to your profile:"
    echo "  alias terry=$HOME/.terry/src/index.mjs"
    exit 1
  fi

  # Check if the profile file already has the command
  if grep -q "alias terry" "$PROFILE_FILE"; then
    # Remove existing terry alias
    echo "📂 Removing existing terry alias..."
    sed -e '/alias terry/d' "$PROFILE_FILE" > "$PROFILE_FILE.tmp"
    mv "$PROFILE_FILE.tmp" "$PROFILE_FILE"
  fi

  # Alias terry
  echo "📂 Aliasing terry..."
  echo "alias terry=\"\$HOME/.terry/src/index.mjs\"" >> $PROFILE_FILE

  # Install completion
  echo "✅ Terry has been installed. Please reload your profile."
}

do_install
