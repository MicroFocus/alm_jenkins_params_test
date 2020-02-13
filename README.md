# Configure Jenkins

1. Setup Jenkins to connect to Octane using the MFAA plugin.  See https://admhelp.microfocus.com/octane/en/15.0.20/Online/Content/AdminGuide/article_CI_servers_setup.htm
2. Add the Node.js plugin to Jenkins (https://plugins.jenkins.io/nodejs/).  Configure it using the user guide.  It is recommended to use the latest Node.js instance
    * Make sure that the Octane Node.js SDK plugin is added as a global dependency in the configuration.  In the _Global npm packages to install_ section add the
    `@microfocus/alm-octane-js-rest-sdk@15.0.20` dependency.
    * For more information about the SDK see here: <https://www.npmjs.com/package/@microfocus/alm-octane-js-rest-sdk>
1. Setup a job in Jenkins that has the following three String parameters:
    * `testsToRun`
    * `suiteId`
    * `suiteRunId`
    
# Prepare Octane
3. Make sure that at least one Release exists in Octane.  Without this the test will not be able to be run
3. Setup a _Test Runner_ in Octane.  See https://admhelp.microfocus.com/octane/en/15.0.20/Online/Content/AdminGuide/how-setup-testing-integration.htm?cshid=test_runner
4. Add UDFs to the automatic test in the settings in Octane (this can be done using the API as well).  For the demo purposes two UDFs are added:
   * `param1_udf`: A string field
   * `param2_udf`: A memo field
4. Create an automatic test in Octane.  These cannot be done using the UI but can be done using the REST API.  See the `createAutomaticTest.js` Node.js example
   * The example creates the memo with an HTML table that has a number of key/value pairs
   * The example also uploads a simple attachment that contains a JSON file
5. In the UI add the Test Runner that was set up above to the _Test Runner_ field in the created automatic test.
   * This can be done automatically using the above API as well
6. Create a new Test Suite that contains the above automated test in the UI.  This can be done using the REST API as well.

# Prepare the Jenkins Job
1. In addition to the above string parameters make sure that the `Micro Focus ALM Octane testing framework converter` step is added to the job (as outlined in the documentation)
2. Add the `Execute NodeJS script` step.  Copy the contents of the `jenkins-step.js` file making sure that the correct octane connection information is added
3. Add the `Publish JUnit test result report` post-build action.

# Run the test from Octane
1. In the UI select the Test Suite and run it.
   * The test should run in Jenkins
   * The result will fail because no xUnit file is created; this should be done
2. In Jenkins the test will fail unless the above is fixed.  HOWEVER a file should be created in the job workspace called `nodeOutput.json` that includes the correct data
   * This is here because it is an easy way to pass data from one job step to the next in Jenkins.

