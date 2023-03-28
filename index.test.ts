import { execa } from 'execa'
import { test, expect } from 'vitest'
import { temporaryDirectory } from 'tempy'

test('setup-ts-project', async () => {
  const directory = temporaryDirectory()

  const { stdout } = await execa('setup-ts-project', [], {
    cwd: directory,
    env: {
      // @ts-expect-error
      FORCE_COLOR: 2,
    },
  })

  console.log('stdout', stdout)
  // TODO: Implement this test
}, 20000)
