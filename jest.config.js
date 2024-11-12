module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFiles: ['<rootDir>/test/setup.ts'],
    testMatch: ['<rootDir>/test/**/*.test.ts'],
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.d.ts'
    ]
};