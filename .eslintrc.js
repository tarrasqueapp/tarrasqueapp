const { resolve } = require('path');

const project = resolve(__dirname, 'tsconfig.json');

module.exports = {
  root: true,
  extends: [
    require.resolve('@tronite/style-guide/eslint/browser'),
    require.resolve('@tronite/style-guide/eslint/node'),
    require.resolve('@tronite/style-guide/eslint/react'),
    require.resolve('@tronite/style-guide/eslint/next'),
    require.resolve('@tronite/style-guide/eslint/typescript'),
  ],
  parserOptions: {
    project,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ['.eslintrc.js'],
};
