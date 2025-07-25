module.exports = {
    maxWorkers: 1,
    // This tells Jest to run a setup file after the test environment is set up,
    // but before the tests themselves run.
    setupFilesAfterEnv: ["./jest.setup.js"],
    // Explicitly tell Jest where to find test files
    testMatch: [
      "**/__tests__/**/*.test.js", // Looks for .test.js files in any __tests__ directory
      "**/?(*.)+(spec|test).js"    // Looks for .spec.js or .test.js files anywhere else
    ],
  };
  