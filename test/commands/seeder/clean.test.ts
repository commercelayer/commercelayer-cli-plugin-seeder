import { runCommand } from '@oclif/test'
import { expect } from 'chai'


describe('seeder:clean', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['seeder:noc'])
    expect(stdout).to.contain('-= NoC =-')
  }).timeout(15000)
})
