#!/usr/bin/env node

import chalk from 'chalk'
import { execa } from 'execa'
import { promises as fs } from 'fs'
import task from 'tasuku'

const templateGitignore = `node_modules
dist
DS_Store`

console.log()
console.log(chalk.blue.bold(' setup-ts-project'))
console.log()

async function createCommit() {
  await execa('git', ['add', '.'])
  await execa('git', [
    'commit',
    '-m',
    'Initialize project with setup-ts-project',
  ])
}

await task.group((task) => [
  task('npm-init-ex', async () => {
    await execa('npx', ['npm-init-ex@latest', '--yes'])
  }),
  task('setup-typescript', async () => {
    await execa('npx', ['setup-typescript@latest', '--yes'])
  }),
  task('create .gitignore', async () => {
    await fs.writeFile('./.gitignore', templateGitignore)
  }),
  task('setup-prettier', async () => {
    await execa('npx', ['setup-prettier@latest', '--yes'])
  }),
  task('create commit', async () => {
    await createCommit()
  }),
])

// TODO: Render after (https://github.com/privatenumber/tasuku/issues/16)
console.log(chalk.green(' project initialized!'))
console.log()
