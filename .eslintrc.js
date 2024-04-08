module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    commonjs: true,
  },
  extends: [
    'plugin:import/recommended',
    'airbnb-typescript/base',
    'plugin:compat/recommended',
    'prettier',
  ],
  parserOptions: {
    project: './tsconfig.lint.json',
  },
  rules: {
    'import/prefer-default-export': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
};
