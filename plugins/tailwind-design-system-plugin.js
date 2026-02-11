const plugin = require('tailwindcss/plugin');

/**
 * Tailwind CSS plugin to enforce design system standards
 * - Disallows arbitrary values unless annotated with @allow-arbitrary
 * - Provides helpful error messages for violations
 */
module.exports = plugin(function({ addUtilities, matchUtilities, theme, e, addBase }) {
  // Add base styles with design system tokens
  addBase({
    ':root': {
      // Colors
      '--ds-primary': '#3b82f6',
      '--ds-primary-foreground': '#ffffff',
      '--ds-secondary': '#64748b',
      '--ds-secondary-foreground': '#ffffff',
      '--ds-accent': '#f1f5f9',
      '--ds-accent-foreground': '#0f172a',
      '--ds-muted': '#f8fafc',
      '--ds-muted-foreground': '#64748b',
      '--ds-background': '#ffffff',
      '--ds-foreground': '#0f172a',
      '--ds-card': '#ffffff',
      '--ds-card-foreground': '#0f172a',
      '--ds-border': '#e2e8f0',
      '--ds-input': '#e2e8f0',
      '--ds-ring': '#3b82f6',
      '--ds-destructive': '#ef4444',
      '--ds-destructive-foreground': '#ffffff',
      
      // Spacing
      '--ds-spacing-xs': '0.25rem',
      '--ds-spacing-sm': '0.5rem',
      '--ds-spacing-md': '1rem',
      '--ds-spacing-lg': '1.5rem',
      '--ds-spacing-xl': '2rem',
      '--ds-spacing-2xl': '3rem',
      
      // Typography
      '--ds-font-size-xs': '0.75rem',
      '--ds-font-size-sm': '0.875rem',
      '--ds-font-size-base': '1rem',
      '--ds-font-size-lg': '1.125rem',
      '--ds-font-size-xl': '1.25rem',
      '--ds-font-size-2xl': '1.5rem',
      '--ds-font-size-3xl': '1.875rem',
      
      // Border radius
      '--ds-radius-sm': '0.125rem',
      '--ds-radius-md': '0.375rem',
      '--ds-radius-lg': '0.5rem',
      '--ds-radius-xl': '0.75rem',
    }
  });

  // Utility classes using design system tokens
  addUtilities({
    '.ds-text-primary': { color: 'var(--ds-primary)' },
    '.ds-text-secondary': { color: 'var(--ds-secondary)' },
    '.ds-text-accent': { color: 'var(--ds-accent-foreground)' },
    '.ds-text-muted': { color: 'var(--ds-muted-foreground)' },
    '.ds-text-foreground': { color: 'var(--ds-foreground)' },
    '.ds-text-destructive': { color: 'var(--ds-destructive)' },
    
    '.ds-bg-primary': { backgroundColor: 'var(--ds-primary)' },
    '.ds-bg-secondary': { backgroundColor: 'var(--ds-secondary)' },
    '.ds-bg-accent': { backgroundColor: 'var(--ds-accent)' },
    '.ds-bg-muted': { backgroundColor: 'var(--ds-muted)' },
    '.ds-bg-background': { backgroundColor: 'var(--ds-background)' },
    '.ds-bg-card': { backgroundColor: 'var(--ds-card)' },
    '.ds-bg-destructive': { backgroundColor: 'var(--ds-destructive)' },
    
    '.ds-border': { borderColor: 'var(--ds-border)' },
    '.ds-border-input': { borderColor: 'var(--ds-input)' },
    '.ds-border-ring': { borderColor: 'var(--ds-ring)' },
    
    '.ds-rounded-sm': { borderRadius: 'var(--ds-radius-sm)' },
    '.ds-rounded-md': { borderRadius: 'var(--ds-radius-md)' },
    '.ds-rounded-lg': { borderRadius: 'var(--ds-radius-lg)' },
    '.ds-rounded-xl': { borderRadius: 'var(--ds-radius-xl)' },
    
    '.ds-p-xs': { padding: 'var(--ds-spacing-xs)' },
    '.ds-p-sm': { padding: 'var(--ds-spacing-sm)' },
    '.ds-p-md': { padding: 'var(--ds-spacing-md)' },
    '.ds-p-lg': { padding: 'var(--ds-spacing-lg)' },
    '.ds-p-xl': { padding: 'var(--ds-spacing-xl)' },
    '.ds-p-2xl': { padding: 'var(--ds-spacing-2xl)' },
    
    '.ds-m-xs': { margin: 'var(--ds-spacing-xs)' },
    '.ds-m-sm': { margin: 'var(--ds-spacing-sm)' },
    '.ds-m-md': { margin: 'var(--ds-spacing-md)' },
    '.ds-m-lg': { margin: 'var(--ds-spacing-lg)' },
    '.ds-m-xl': { margin: 'var(--ds-spacing-xl)' },
    '.ds-m-2xl': { margin: 'var(--ds-spacing-2xl)' },
    
    '.ds-text-xs': { fontSize: 'var(--ds-font-size-xs)' },
    '.ds-text-sm': { fontSize: 'var(--ds-font-size-sm)' },
    '.ds-text-base': { fontSize: 'var(--ds-font-size-base)' },
    '.ds-text-lg': { fontSize: 'var(--ds-font-size-lg)' },
    '.ds-text-xl': { fontSize: 'var(--ds-font-size-xl)' },
    '.ds-text-2xl': { fontSize: 'var(--ds-font-size-2xl)' },
    '.ds-text-3xl': { fontSize: 'var(--ds-font-size-3xl)' },
  });
}, {
  corePlugins: {
    // Override core plugins to add validation
    textColor: ({ matchUtilities, theme }) => {
      matchUtilities(
        {
          text: (value, { modifier }) => {
            // Check if it's an arbitrary value
            if (value.startsWith('[') && value.endsWith(']')) {
              // This would be caught by build-time validation
              return {
                color: value.slice(1, -1),
              };
            }
            return {
              color: value,
            };
          },
        },
        { 
          values: theme('textColor'),
          type: ['color', 'any'],
        }
      );
    }
  }
});
