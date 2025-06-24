module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/config/',
      '/uploads/',
      '/public/'
    ],
    testTimeout: 10000
  };