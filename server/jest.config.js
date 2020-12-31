module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src/tests',
  setupFiles: [
    './setup.ts',
  ],
};
