# README

The common [README.md](../README.md]) is the default from [t3 create turbo app](https://github.com/t3-oss/create-t3-turbo.git). Our goal is to have a custom template but still be able to pull the changes from t3. So we decided NOT to make any change to the files existing in t3, but just add new folder/files.

So this file exists to explain how we use this custom template to kick off an initial project.

## 1. Update the template repo

Before using this template, sync it with t3:

```sh
# Step 0, make sure you have these GLOBAL
# You can still merge the old way with git `pull --no-rebase`
git config --global pull.rebase
git config --global branch.autoSetupRebase always

git remote add upstream https://github.com/t3-oss/create-t3-turbo.git
git fetch upstream
git merge upstream/main
git checkout --theirs .

nvm install
npm install --global pnpm
pnpm install
pnpm format:fix # Prettier
pnpm lint:fix # Eslint
pnpm test
```

## 2. Improve our template

Complete at least one task from the [project](https://github.com/Labrys-Group/create-t3-turbo/projects?query=is%3Aopen).

## 3. Use the template

```sh
# In your project folder
npx create-turbo@latest -e https://github.com/Labrys-Group/create-t3-turbo
```
