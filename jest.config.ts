import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/*.jest.spec.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.jest.json' },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!@angular|rxjs)'],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'json'],
};

export default config;
