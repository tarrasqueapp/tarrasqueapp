#!/bin/bash

echo "📂  Cleaning root..."
sudo rm -rf yarn-error.log node_modules

echo "📂  Cleaning client..."
cd apps/client
sudo rm -rf yarn-error.log node_modules .next dist

echo "📂  Cleaning server..."
cd ../server
sudo rm -rf yarn-error.log node_modules dist

echo "✅  Cleaned!"
