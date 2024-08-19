import * as core from '@actions/core';
import * as github from '@actions/github';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const runName: string = core.getInput('run_name');

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Test run name: ${runName}`);

    // Set outputs for other workflow steps to use
    let runAttempt = parseInt(process.env.GITHUB_RUN_ATTEMPT as string, 10);
    core.debug(`Run attempt: ${runAttempt}`);

    if (runAttempt == 1) {
      // there can be no previously failed tests if this is the first run attempt
      // so we can just return with no failed tests
      core.setOutput('failed_tests', []);
      core.debug(`exiting with empty failed tests`);
      return;
    }

    const token = core.getInput('github_token');
    if (!token) {
      core.setFailed('Input `github_token` is required');
      return;
    }

    core.debug(`Repo owner: ${github.context.repo.owner}`);
    core.debug(`Repo: ${github.context.repo.repo}`);

    const octokit = github.getOctokit(token);

    // call the API to get the list of artifacts for this workflow run
    let response = await octokit.rest.actions.listWorkflowRunArtifacts({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      run_id: github.context.runId,
      per_page: 100,
      page: 1
    });

    if (response.status != 200) {
      core.setFailed('Failed to retrieve list of workflow run artifacts');
      return;
    }

    if (response.data.total_count == 0) {
      core.setOutput('failed_tests', []);
      core.debug(`exiting with no previously failed tests`);
      return;
    }

    core.debug(`Response: ${JSON.stringify(response.data.artifacts)}`);

    // try and find the artifact related to the previous test run
    let artifacts = response.data.artifacts.filter(
      artifact => artifact.name == `${runName}-attempt-${runAttempt - 1}`
    );

    if (artifacts.length != 1) {
      core.setOutput('failed_tests', []);
      core.debug(`exiting with no previously failed tests`);
      return;
    }

    // now we get the download url of the artifact
    let artifactDownloadUrl = artifacts[0].archive_download_url;

    core.debug(`Download url: ${artifactDownloadUrl}`);

    core.setOutput('failed_tests', ['failed-test1', 'failed-test2']);

    // go through the list of artifacts and look for any related to this job

    // if found then get the most recent artifact (need to make sure that each run attempt creates a new artifact)

    // open up the file and get the list of failed tests

    core.debug(`This is working....yeah baby!`);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
