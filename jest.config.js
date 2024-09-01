module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  testMatch: ['**/+(*.)+(jest).+(ts|js)?(x)'],
  testEnvironment: 'jsdom',
}
