import path from 'node:path'
import { readFile } from 'node:fs/promises'

import spawn from 'nano-spawn'
import { test, expect } from 'vitest'
import { temporaryDirectory } from 'tempy'
import { getBinPath } from 'get-bin-path'
import { PackageJson, readPackage } from 'read-pkg'

import testTemplate from './src/testTemplate'

test('setup-ts-project', async () => {
  const binPath = await getBinPath()
  if (!binPath) {
    throw new Error('Bin path not found')
  }
  const directory = temporaryDirectory()

  await spawn('git', ['init'], {
    cwd: directory,
  })

  const { stdout } = await spawn(binPath, [], {
    cwd: directory,
    env: {
      FORCE_COLOR: '2',
    },
  })

  const testFile = (
    await readFile(path.join(directory, 'index.test.ts'))
  ).toString()
  expect(testFile).toEqual(testTemplate)

  const srcFile = (
    await readFile(path.join(directory, 'src/index.ts'))
  ).toString()
  expect(srcFile).toEqual('')

  const packageJson = (await readPackage({
    cwd: directory,
    normalize: false,
  })) as PackageJson & {
    devDependencies: Record<string, string>
  }

  expect(packageJson.devDependencies).toHaveProperty('vitest')
  expect(packageJson.scripts).toHaveProperty('test')
  // TODO: Test that commit is actually created?

  console.log('stdout', stdout)
}, 30000)

test('skip commit', async () => {
  const binPath = await getBinPath()
  if (!binPath) {
    throw new Error('Bin path not found')
  }
  const directory = temporaryDirectory()

  await spawn('git', ['init'], {
    cwd: directory,
  })

  const { stdout } = await spawn(binPath, ['--skip-commit'], {
    cwd: directory,
    env: {
      FORCE_COLOR: '2',
    },
  })

  // TODO: Test that commit is actually NOT created?
  console.log('stdout', stdout)
}, 30000)
