import {Context} from '@actions/github/lib/context'
import {Action} from '../src/action'

describe('Action', () => {
  it('returns a label matching a pattern', async () => {
    expect.assertions(1)

    Action.prototype.listLabelsOnIssue = jest
      .fn()
      .mockImplementation(async (token: string) => {
        return new Array('deploy:csa', 'deploy:barcode')
      })


      
    var fakeContext = new Context()
    fakeContext.repo.owner = 'john'
    fakeContext.repo.repo = 'repo'
    fakeContext.issue.number = 1

    var action = new Action('anytoken', fakeContext)

    var output = await action.run('^deploy:([^$]+)$', 1)

    expect(output).toEqual(new Array('csa', 'barcode'))
  })
})
