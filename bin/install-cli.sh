#!/bin/bash
set -e

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")
DIR=$(dirname "$SCRIPT_PATH")

do_install() {
  # Install dependencies
  echo "📂 Installing dependencies..."
  yarn install

  # Detect profile file
  if [ -f "$HOME/.zshrc" ]; then
    PROFILE_FILE="$HOME/.zshrc"
  elif [ -f "$HOME/.bash_profile" ]; then
    PROFILE_FILE="$HOME/.bash_profile"
  elif [ -f "$HOME/.bashrc" ]; then
    PROFILE_FILE="$HOME/.bashrc"
  else
    echo "🚨 Unable to find a profile file. Please add the following to your profile:"
    echo "  alias tarrasque=$DIR/cli/index.mts"
    exit 1
  fi


  # Check that the profile file exists
  if [ ! -f "$PROFILE_FILE" ]; then
    echo "🚨 Unable to find a profile file. Please add the following to your profile:"
    echo "  alias tarrasque=$DIR/cli/index.mts"
    exit 1
  fi

  # Check if the profile file already has the command
  if grep -q "alias tarrasque" "$PROFILE_FILE"; then
    # Remove existing tarrasque alias
    echo "📂 Removing existing tarrasque alias..."
    sed -e '/alias tarrasque/d' "$PROFILE_FILE" > "$PROFILE_FILE.tmp"
    mv "$PROFILE_FILE.tmp" "$PROFILE_FILE"
  fi

  # Alias tarrasque
  echo "📂 Aliasing tarrasque..."
  echo "alias tarrasque=\"$DIR/cli/index.mts\"" >> $PROFILE_FILE

  # Install completion
  echo "✅️ Tarrasque CLI has been installed."
}

do_install
