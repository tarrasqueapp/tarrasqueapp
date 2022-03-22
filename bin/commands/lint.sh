#!/bin/bash

echo "📂  Linting root..."
yarn lint

echo ""
echo "📂  Linting client..."
cd apps/client
yarn lint

echo ""
echo "📂  Linting server..."
cd ../server
yarn lint

echo ""
echo "✅  Linted!"
