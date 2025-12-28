#!/bin/bash

# Abort if git status is not clean
if [[ -n $(git status --porcelain) ]]; then
  echo "Error: Git working directory must be clean."
  exit 1
fi

# Prep the readme for _this_ project
rm README.md
rm TEMPLATE-README.md
mv PROJECT-README.md README.md

# Make a freshly minted env file
cp .env.example .env

rm scripts/init-project.sh # What a selfless hero!

git add --all
git commit -m "chore: ./scripts/init-project.sh"

echo "Now make README.md relevant to your project!"
