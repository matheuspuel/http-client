import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/', //
    '<rootDir>/lib/',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
}
export default config
