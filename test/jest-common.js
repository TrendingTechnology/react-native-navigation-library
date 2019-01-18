const path = require('path')

module.exports = {
  preset: 'react-native',
  rootDir: path.resolve(__dirname, '..'),
  moduleDirectories: [
    'node_modules',
    __dirname,
    path.resolve(__dirname, '../src'),
  ],
  transformIgnorePatterns: ['node_modules/(?!(react-native)/)'],
  transform: {
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  setupTestFrameworkScriptFile: path.resolve(__dirname, './setup-tests.js'),
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}
