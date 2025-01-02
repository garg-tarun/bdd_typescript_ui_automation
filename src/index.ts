import { exec } from "child_process";

// Initialise a common_arguments command string for running cucumber tests
const common_arguments = `./src/features/*.feature \
  --require-module ts-node/register \
  --require ./src/step-definitions/**/**/*.ts \
  --require src/hooks/**/*.ts \
  --format json:./reports/report.json \
  --format html:./reports/report.html  `;

// Define an interface for the test profiles using tags 
interface TestProfiles {
    [key: string]: string;
}

// Define a command strings for different test profiles
const profiles: TestProfiles = {
    smoke: `${common_arguments} --tags "@smoke"`,
    regression: `${common_arguments} --tags "@regression"`,
}

// Fetch the test tag as third command-line argument and assign it to the profile
const profile = process.argv[2];

// Construct the complete command based on the selected profile 
// to run the tests for the selected profile
let command = `npx cucumber-js ${profiles[profile as 'smoke' | 'regression']}`;

// Print the command
console.log(command);

// Execute the command
exec(command, { encoding: 'utf-8'}, (error: Error | null, stdout: string) =>{
  //Log the output of the command
  console.log(stdout);

  //check if there was an error during execution
  if(error) {
    //throw a new error with a simple message
    throw new Error('Some automation test(s) have failed! - Please review. ⚠️ 💥')
  }
});
