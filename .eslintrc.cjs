module.exports = {
  root: true,
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    //    "plugin:storybook/recommended"
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier' : [
      'error' ,
      {
        'semi': false,
        'tabWidth': 2,
        'printWidth': 100,
        'singleQuote': true,
        'trailingComma': 'all',
        'jsxSingleQuote': true,
        'bracketSpacing': true,
        'endOfLine': 'auto'
      }
    ]
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    JSX: true,
  },
  ignorePatterns: [
    "node_modules",
    "dist",
    "public",
    "src/reportWebVitals.ts",
    "src/setupTests.ts",
    "src/stories"
  ],
}
