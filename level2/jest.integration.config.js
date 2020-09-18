module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  testRegex: '(/.*(\\.|/)(integration))\\.ts$',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
};
