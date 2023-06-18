import { execa } from 'execa'
import { test, expect } from 'vitest'
import { temporaryDirectory } from 'tempy'
import { getBinPath } from 'get-bin-path'

test('setup-ts-project', async () => {
  const binPath = await getBinPath()
  if (!binPath) {
    throw new Error('Bin path not found')
  }
  const directory = temporaryDirectory()

  await execa('git', ['init'], {
    cwd: directory,
  })

  const { stdout } = await execa(binPath, [], {
    cwd: directory,
    env: {
      // @ts-expect-error
      FORCE_COLOR: 2,
    },
  })

  // TODO: Test that commit is actually created?
  console.log('stdout', stdout)
  expect(stdout).toMatchSnapshot()
}, 20000)

test('skip commit', async () => {
  const binPath = await getBinPath()
  if (!binPath) {
    throw new Error('Bin path not found')
  }
  const directory = temporaryDirectory()

  await execa('git', ['init'], {
    cwd: directory,
  })

  const { stdout } = await execa(binPath, ['--skip-commit'], {
    cwd: directory,
    env: {
      // @ts-expect-error
      FORCE_COLOR: 2,
    },
  })

  // TODO: Test that commit is actually NOT created?
  console.log('stdout', stdout)
  expect(stdout).toMatchSnapshot()
}, 20000)
