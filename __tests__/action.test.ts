import {Action} from '../src/action'

describe('Action', () => {
  it('returns a label matching a pattern', async () => {
    expect.assertions(1)

    Action.prototype.listLabelsOnIssue = jest
      .fn()
      .mockImplementation(async (token: string) => {
        return new Array('deploy:csa', 'deploy:barcode')
      })

    var action = new Action('anytoken', null)

    var output = await action.run('^deploy:([^$]+)$', 1)

    expect(output).toEqual(new Array('csa', 'barcode'))
  })
})
