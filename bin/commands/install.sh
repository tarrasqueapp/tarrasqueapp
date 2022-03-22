#!/bin/bash

echo "📂  Installing root..."
yarn

echo ""
echo "📂  Installing client..."
cd apps/client
yarn

echo ""
echo "📂  Installing server..."
cd ../server
yarn

echo ""
echo "✅  Installed!"
