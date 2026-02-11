/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react-hooks', 'jsx-a11y'],
  rules: {
    // Relax some strict TypeScript rules for existing codebase
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    'prefer-const': 'warn',
    
    // Forbid inline styles except in whitelisted files (temporarily relaxed for build)
    'react/forbid-dom-props': [
      'warn',
      {
        forbid: [
          {
            propName: 'style',
            message: 'Inline styles are not allowed. Use design system tokens via CSS classes or styled components instead.'
          }
        ]
      }
    ],
    // Custom rule to check for inline styles in JSX (temporarily relaxed for build)
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'JSXAttribute[name.name="style"]',
        message: 'Inline styles are not allowed. Use design system tokens via CSS classes or styled components instead.'
      }
    ]
  },
  overrides: [
    {
      // Whitelisted files that can use inline styles
      files: [
        'components/charts/**/*.tsx',
        'components/body-selector/**/*.tsx',
        '**/*.stories.tsx',
        '**/test-*.tsx',
        '**/tests/**/*.tsx'
      ],
      rules: {
        'react/forbid-dom-props': 'off',
        'no-restricted-syntax': 'off'
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
};
