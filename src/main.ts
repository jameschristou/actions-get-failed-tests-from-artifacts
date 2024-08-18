import * as core from '@actions/core';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const nameOfTheTestRun: string = core.getInput('name_of_the_test_run');

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Test run name ${nameOfTheTestRun}`);

    // Set outputs for other workflow steps to use
    let runAttempt = parseInt(process.env.GITHUB_RUN_ATTEMPT as string, 10);
    core.debug(`Run attempt: ${runAttempt}`);
    
    if(runAttempt == 1){
      // there can be no previously failed tests if this is the first run attempt
      core.setOutput('failed_tests', []);
      core.debug(`exiting with empty failed tests`);
      return;
    }

    core.setOutput('failed_tests', ['failed-test1', 'failed-test2']);

    // if this is the first run attempt then nothing to do...just return an empty list

    // otherwise call the API to get the list of artifacts for this workflow run

    // go through the list of artifacts and look for any related to this job

    // if found then get the most recent artifact (need to make sure that each run attempt creates a new artifact)

    // open up the file and get the list of failed tests

    core.debug(`This is working....yeah baby!`);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
