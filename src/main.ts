import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token', { required: true });
    const pattern = core.getInput('pattern', { required: true });
    const group = core.getInput('group', { required: true })

    const labels = await listLabelsOnIssue(token);
    core.info("Found " + labels.length + " labels")

    let substrings = extractTextFromLabels(labels, new RegExp(pattern), Number(group))

    core.setOutput("substrings", substrings);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function listLabelsOnIssue(token: string) {
  // Fetch the list of labels attached to the issue that
  // triggered the workflow
  let client = github.getOctokit(token);

  const opts = client.issues.listLabelsOnIssue.endpoint.merge({
    ...github.context.repo,
    issue_number: github.context.issue.number
  });

  return await client.paginate<any>(opts);
}

function extractTextFromLabels(labels: any[], pattern: RegExp, index: number) {
  let substrings = []
  for (const label of labels) {
    var match = label.name.match(pattern);
    if (match && index <= match.length - 1 && substrings.findIndex(match[index]) > 0) {
      substrings.push(match[index]);
    }
  }

  return substrings;
}

run()
