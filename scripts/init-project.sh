#!/bin/bash

# Abort if git status is not clean
if [[ -n $(git status --porcelain) ]]; then
  echo "Error: Git working directory must be clean."
  exit 1
fi

# Remove MIT license
sed -i '' '/"license": "MIT",/d' package.json
sed -i '' '/"license": "MIT",/d' packages/ui/package.json
sed -i '' '/"license": "MIT",/d' packages/auth/package.json
sed -i '' '/"license": "MIT",/d' packages/db/package.json
sed -i '' '/"license": "MIT",/d' packages/api/package.json
sed -i '' '/"license": "MIT",/d' packages/validators/package.json
rm LICENSE

# Prep the readme for _this_ project
rm README.md
rm LABRYS-README.md
mv PROJECT-README.md README.md

# Husky and conventional commits
echo "Setting up Husky..."
pnpm add -D -w husky @commitlint/cli @commitlint/config-conventional
pnpm exec husky init
echo "pnpm exec commitlint --edit \$1" > .husky/commit-msg
chmod +x .husky/commit-msg
echo "DONE."

# rm scripts/init-project.sh # What a selfless hero!

git add --all
git commit -m "chore: ./scripts/init-project.sh"

echo "Now make README.md relevant to your project!"
