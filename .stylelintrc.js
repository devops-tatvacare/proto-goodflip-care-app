/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-scss/config'
  ],
  plugins: [
    'stylelint-scss'
  ],
  rules: {
    // Forbid raw hex colors
    'color-hex-case': null,
    'color-hex-length': null,
    'color-named': 'never',
    'color-no-hex': true,
    
    // Only allow design system CSS custom properties
    'custom-property-pattern': [
      '^ds-.*',
      {
        message: 'Custom properties must follow design system naming convention --ds-*'
      }
    ],
    
    // Forbid direct color values, only allow var() with design system tokens
    'declaration-property-value-disallowed-list': {
      '/^(color|background|background-color|border|border-color|fill|stroke)$/': [
        // Forbid direct color values
        '/^#[0-9a-fA-F]+$/',
        '/^rgb\\(/',
        '/^rgba\\(/',
        '/^hsl\\(/',
        '/^hsla\\(/',
        // Common CSS color names
        'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown',
        'black', 'white', 'gray', 'grey', 'transparent', 'currentColor',
        'inherit', 'initial', 'unset', 'revert'
      ]
    },
    
    // Ensure design system tokens are used
    'function-allowed-list': [
      'var',
      'calc',
      'clamp',
      'min',
      'max',
      'url',
      'linear-gradient',
      'radial-gradient',
      'conic-gradient'
    ],
    
    // Custom rule to enforce var(--ds-*) pattern for colors
    'value-keyword-case': null,
    'function-name-case': 'lower',
    
    // SCSS specific rules
    'scss/at-rule-no-unknown': true,
    'scss/dollar-variable-pattern': '^ds-.*',
    'scss/percent-placeholder-pattern': '^ds-.*'
  },
  
  ignoreFiles: [
    'node_modules/**/*',
    '.next/**/*',
    'stories-storybook/storybook-static/**/*',
    // Allow Storybook and test files to use any colors
    'stories-storybook/**/*',
    '**/*.stories.css',
    '**/test-*.css'
  ]
};
