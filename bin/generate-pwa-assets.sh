#!/bin/sh

IMAGES_PATH="./packages/client/public/images"
BACKGROUND="#181410"
RELATIVE_PATH="/images/icons"

yarn pwa-asset-generator $IMAGES_PATH/logo.svg $IMAGES_PATH/icons --background $BACKGROUND --path-override $RELATIVE_PATH --favicon --xhtml
# yarn pwa-asset-generator $IMAGES_PATH/logo.svg $IMAGES_PATH/icons --opaque false --path-override $RELATIVE_PATH --favicon --xhtml --icon-only --padding "0"
