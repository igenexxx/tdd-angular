module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular',
  },
  testMatch: ['**/+(*.)+(jest).+(ts|js)?(x)'],
  testEnvironment: 'jsdom',
}
