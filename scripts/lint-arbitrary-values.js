#!/usr/bin/env node

/**
 * Build-time script to check for arbitrary Tailwind values without proper annotation
 * Usage: node scripts/lint-arbitrary-values.js
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Patterns to match arbitrary Tailwind values
const ARBITRARY_VALUE_PATTERN = /className\s*=\s*["`']([^"`']*\[[^\]]+\][^"`']*)["`']/g;
const ARBITRARY_PROPERTY_PATTERN = /className\s*=\s*["`']([^"`']*\[[^\]]+:[^\]]+\][^"`']*)["`']/g;

// Allow annotation pattern
const ALLOW_ARBITRARY_PATTERN = /\/\*\s*@allow-arbitrary\s*\*\//;

// File extensions to check
const FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

// Directories to exclude
const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  // Storybook static output (old and new locations)
  'storybook-static',
  'stories-storybook/storybook-static'
];

function findArbitraryValues() {
  const errors = [];
  
  // Find all relevant files
  const files = glob.sync('**/*.{tsx,ts,jsx,js}', {
    ignore: EXCLUDED_DIRS.map(dir => `${dir}/**`)
  });

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Check for arbitrary values
    let match;
    
    // Reset regex global flag
    ARBITRARY_VALUE_PATTERN.lastIndex = 0;
    ARBITRARY_PROPERTY_PATTERN.lastIndex = 0;
    
    while ((match = ARBITRARY_VALUE_PATTERN.exec(content)) !== null) {
      const matchIndex = match.index;
      const lineNumber = content.substring(0, matchIndex).split('\n').length;
      const line = lines[lineNumber - 1];
      
      // Check if there's an allow annotation on the same line or line above
      const hasAnnotation = ALLOW_ARBITRARY_PATTERN.test(line) || 
                           (lines[lineNumber - 2] && ALLOW_ARBITRARY_PATTERN.test(lines[lineNumber - 2]));
      
      if (!hasAnnotation) {
        errors.push({
          file: filePath,
          line: lineNumber,
          column: match.index - content.lastIndexOf('\n', matchIndex),
          message: `Arbitrary Tailwind value '${match[1]}' requires /* @allow-arbitrary */ annotation`,
          value: match[1]
        });
      }
    }
    
    // Check for arbitrary properties
    while ((match = ARBITRARY_PROPERTY_PATTERN.exec(content)) !== null) {
      const matchIndex = match.index;
      const lineNumber = content.substring(0, matchIndex).split('\n').length;
      const line = lines[lineNumber - 1];
      
      // Check if there's an allow annotation
      const hasAnnotation = ALLOW_ARBITRARY_PATTERN.test(line) || 
                           (lines[lineNumber - 2] && ALLOW_ARBITRARY_PATTERN.test(lines[lineNumber - 2]));
      
      if (!hasAnnotation) {
        errors.push({
          file: filePath,
          line: lineNumber,
          column: match.index - content.lastIndexOf('\n', matchIndex),
          message: `Arbitrary Tailwind property '${match[1]}' requires /* @allow-arbitrary */ annotation`,
          value: match[1]
        });
      }
    }
  });

  return errors;
}

function main() {
  console.log('🔍 Checking for unannotated arbitrary Tailwind values...\n');
  
  const errors = findArbitraryValues();
  
  if (errors.length === 0) {
    console.log('✅ No arbitrary Tailwind values found without proper annotation!\n');
    process.exit(0);
  }
  
  console.log(`❌ Found ${errors.length} arbitrary Tailwind value(s) without annotation:\n`);
  
  // Group errors by file
  const errorsByFile = errors.reduce((acc, error) => {
    if (!acc[error.file]) acc[error.file] = [];
    acc[error.file].push(error);
    return acc;
  }, {});
  
  Object.entries(errorsByFile).forEach(([file, fileErrors]) => {
    console.log(`📄 ${file}:`);
    fileErrors.forEach(error => {
      console.log(`  Line ${error.line}: ${error.message}`);
      console.log(`    Value: ${error.value}`);
      console.log(`    Fix: Add /* @allow-arbitrary */ comment above or on the same line\n`);
    });
  });
  
  console.log('💡 Design System Violation:');
  console.log('   Use design system tokens instead of arbitrary values when possible:');
  console.log('   - ds-text-primary instead of text-[#3b82f6]');
  console.log('   - ds-p-md instead of p-[16px]');
  console.log('   - ds-rounded-lg instead of rounded-[8px]\n');
  
  process.exit(1);
}

if (require.main === module) {
  main();
}
