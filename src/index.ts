#!/usr/bin/env node

import chalk from 'chalk'
import { execa } from 'execa'
import { promises as fs } from 'fs'
import task from 'tasuku'
import cac from 'cac'
import writePrettyFile from 'write-pretty-file'
import { readPackage } from 'read-pkg'
import sortPackageJson from 'sort-package-json'
import { writePackage } from 'write-pkg'

import packageJson from '../package.json' assert { type: 'json' }
import testTemplate from './testTemplate.js'

const cli = cac()

cli.option('--skip-commit', 'Do not create a commit', {
  default: false,
})
cli.help()
cli.version(packageJson.version)
const parsed = cli.parse()

const templateGitignore = `node_modules
dist
.DS_Store
.eslintcache
.stylelintcache
tsconfig.tsbuildinfo
`

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
  task('create source file', async () => {
    writePrettyFile('src/index.ts', '')
  }),
  task('add tests', async () => {
    await execa('npm', ['install', 'vitest', '--save-dev'])
    writePrettyFile('index.test.ts', testTemplate)

    const packageJson = await readPackage({
      normalize: false,
    })

    const updatedPackageJson = sortPackageJson({
      ...packageJson,
      scripts: packageJson.scripts
        ? {
            ...packageJson.scripts,
            test: 'vitest',
          }
        : {
            test: 'vitest',
          },
    })

    // @ts-expect-error - sort-package-json doesn't return a compatible type
    await writePackage(updatedPackageJson)
  }),
  task(
    !parsed.options['skipCommit']
      ? 'create commit'
      : 'create commit (will skip)',
    async ({ setTitle }) => {
      if (!parsed.options['skipCommit']) {
        await createCommit()
      } else {
        setTitle('create commit - skipped!')
      }
    },
  ),
])

// TODO: Render after (https://github.com/privatenumber/tasuku/issues/16)
console.log(chalk.green(' project initialized!'))
console.log()
