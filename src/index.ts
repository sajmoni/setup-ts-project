import chalk from 'chalk'
import { execa } from 'execa'
import { promises as fs } from 'fs'

const templateGitignore = `node_modules
dist
DS_Store`

console.log()
console.log(chalk.blue(' setup-ts-project'))
console.log()
console.log(' please wait...')
console.log()

await execa('npx', ['npm-init-ex@latest', '--yes'])
await execa('npx', ['setup-prettier@latest', '--yes'])
await execa('npx', ['setup-typescript@latest', '--yes'])

await fs.writeFile('./.gitignore', templateGitignore)

async function createCommit() {
  await execa('git', ['init'])
  await execa('git', ['add', '.'])
  await execa('git', [
    'commit',
    '-m',
    'Initialize project with setup-ts-project',
  ])
}
await createCommit()

console.log()
console.log(chalk.green(' project initialized!'))
console.log()
