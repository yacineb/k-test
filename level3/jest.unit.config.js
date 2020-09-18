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

  testRegex: '(/.*(\\.|/)(unit))\\.ts$',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
};
