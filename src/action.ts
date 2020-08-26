import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import {SafeRegExp} from './safe-regex'

export class Action {
  token: string
  context: Context

  constructor(token: string, context: Context) {
    this.token = token
    this.context = context
  }

  async run(pattern: string, group: number): Promise<string[]> {
    const labels = await this.listLabelsOnIssue(this.token)

    return this.extractTextFromLabels(
      labels,
      new SafeRegExp(pattern, 1000, 'i'),
      group
    )
  }

  async listLabelsOnIssue(token: string): Promise<string[]> {
    // Fetch the list of labels attached to the issue that
    // triggered the workflow
    const client = github.getOctokit(token)

    const labels = await client.paginate(client.issues.listLabelsOnIssue, {
      ...this.context.repo,
      issue_number: this.context.issue.number
    })

    return labels.map(label => label.name)
  }

  extractTextFromLabels(
    labels: string[],
    pattern: SafeRegExp,
    index: number
  ): string[] {
    const substrings = Array.of<string>()

    for (const label of labels) {
      if (pattern.test(label)) {
        const match = pattern.exec(label)

        if (
          match &&
          index <= match.length - 1 &&
          !substrings.includes(match[index])
        ) {
          substrings.push(match[index])
        }
      }
    }

    return substrings
  }
}
