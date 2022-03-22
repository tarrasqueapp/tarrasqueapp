#!/bin/bash

echo "📂  Upgrading root..."
yarn upgrade

echo ""
echo "📂  Upgrading client..."
cd apps/client
yarn upgrade

echo ""
echo "📂  Upgrading server..."
cd ../server
yarn upgrade

echo ""
echo "✅  Upgraded!"
