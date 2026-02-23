#!/bin/bash

# Fix common TypeScript errors in Ziliu project

echo "Fixing TypeScript errors across API routes..."

# Fix transaction parameter types
find src/app/api -name "*.ts" -exec sed -i 's/async (tx) =>/async (tx: any) =>/g' {} \;

# Fix orderBy callback functions - replace with direct references
find src/app/api -name "*.ts" -exec sed -i 's/orderBy: (.*,.*desc.*) => \[desc(\1\./orderBy: [desc(/g' {} \;

# Fix map/forEach callbacks with any types temporarily
find src/app/api -name "*.ts" -exec sed -i 's/\.map(\([a-zA-Z]*\) =>/\.map((\1: any) =>/g' {} \;
find src/app/api -name "*.ts" -exec sed -i 's/\.forEach(\([a-zA-Z]*\) =>/\.forEach((\1: any) =>/g' {} \;

echo "TypeScript fixes applied!"