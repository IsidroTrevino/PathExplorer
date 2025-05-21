module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/tests/e2e/**/*.test.e2e.{js,ts,tsx}', '**/src/tests/e2e/**/*.test.e2e.{js,ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testTimeout: 60000,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};
