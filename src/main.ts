import * as core from '@actions/core'
import * as github from '@actions/github'
import {Action} from './action'

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token', {required: true})
    const pattern = core.getInput('pattern', {required: true})
    const group = core.getInput('group', {required: true})

    const action = new Action(token, github.context)

    let output = await action.run(pattern, Number(group))

    core.setOutput('substrings', output)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
