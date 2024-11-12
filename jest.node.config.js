module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test/node'],
    setupFiles: ['<rootDir>/test/setup.ts'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverageFrom: [
      'src/node/**/*.ts',
      '!src/**/*.d.ts'
    ]
  };