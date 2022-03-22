#!/bin/bash

echo "📂  Checking root..."
ncu

echo ""
echo "📂  Checking client..."
cd apps/client
ncu

echo ""
echo "📂  Checking server..."
cd ../server
ncu

echo ""
echo "✅  Checked!"
