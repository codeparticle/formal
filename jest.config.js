const config = {
  preset: `ts-jest`,
  rootDir: `.`,
  testMatch: [`<rootDir>/test/**/*.ts?(x)`],
  testPathIgnorePatterns: [`dist`],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: [`<rootDir>/config/setup-tests.js`],
  watchPlugins: [
    `jest-watch-typeahead/filename`,
    `jest-watch-typeahead/testname`,
  ],
}

// eslint-disable-next-line unicorn/prefer-module
module.exports = config
