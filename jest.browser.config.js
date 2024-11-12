module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/test/browser'],
    setupFiles: ['<rootDir>/test/setup.ts'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverageFrom: [
      'src/browser/**/*.ts',
      '!src/**/*.d.ts'
    ]
  };