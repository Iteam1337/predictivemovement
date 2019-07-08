module.exports = {
  collectCoverageFrom: ['lib/**/*.js'],
  coveragePathIgnorePatterns: [
    '__fixtures__',
    '__mocks__',
    '__tests__',
    'node_modules/',
  ],
  coverageReporters: ['text'],
  setupFilesAfterEnv: ['jest-expect-message'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}
