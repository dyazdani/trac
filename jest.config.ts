import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  globalSetup: './src/utils/test/reset-db.ts',
  testEnvironment: 'node',
  moduleDirectories: [
    "node_modules", 
    "src"
  ],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
}

export default jestConfig