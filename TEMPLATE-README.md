# README

The common [README.md](../README.md]) is the default from [t3 create turbo app](https://github.com/t3-oss/create-t3-turbo.git). Our goal is to have a custom template but still be able to pull the changes from t3. So we decided NOT to make any change to the files existing in t3, but just add new folder/files.

So this file exists to explain how we use this custom template to kick off an initial project.

## 1. Local setup

Before using this template, sync it with t3 if needed (it should already be up to date):

1. [Go to the workflow](https://github.com/Labrys-Group/create-t3-turbo/actions/workflows/sync-upstream.yml)
2. Click "Run workflow"

## 2. Improve our template

Complete at least one task from the [project](https://github.com/Labrys-Group/create-t3-turbo/projects?query=is%3Aopen).

## 3. Use the template

To use the latest version of the template, and have it prompt you for the project name:

```sh
# In your project folder
npx create-turbo@latest -e https://github.com/Labrys-Group/create-t3-turbo
# Select pnpm
cd $your_project
./scripts/init-project.sh
```

To use a branch of the template (eg: `example-branch`), and have it create a folder (eg: `example-folder-name`):

```bash
 npx create-turbo@latest example-folder-name -e https://github.com/Labrys-Group/create-t3-turbo/tree/example-branch
```

TIP: If your branch has special characters you may need to escape them, eg: `feat/my-feature` -> `feat%2Fmy-feature`

## READMEs

1. README - T3 original that we don't want to edit
2. TEMPLATE-README - edits for the T3 template in a separate file to avoid conflicts
3. PROJECT-README - template for the final client project readme, renamed README in `init-project.sh`
