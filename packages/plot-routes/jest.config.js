module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  clearMocks: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  setupFilesAfterEnv: ['jest-expect-message'],
  coveragePathIgnorePatterns: ['node_modules', '__fixtures__'],
  coverageReporters: ['text'],
}
