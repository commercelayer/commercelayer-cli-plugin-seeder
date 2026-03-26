import { runCommand } from '@oclif/test'
import { expect } from 'chai'


describe('seeder:check', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['seeder:noc'])
    expect(stdout).to.contain('-= NoC =-')
  }).timeout(5000)
})
