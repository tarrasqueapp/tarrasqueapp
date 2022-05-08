#!/bin/sh
set -e

# Get Terry git repository
TERRY_GIT_REPO="https://github.com/tarrasqueapp/terry-cli.git"

do_install() {
  # Check that Terry is not already installed
  if [ -d "$HOME/.terry" ]; then
    echo "🚨 Terry is already installed. Please remove ~/.terry and try again."
    exit 1
  fi

  # Clone the repository
  echo "📂 Cloning Terry CLI..."
  git clone $TERRY_GIT_REPO ~/.terry

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
  echo "✅️ Terry has been installed. Please reload your profile."
}

do_install
