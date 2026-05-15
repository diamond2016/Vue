import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

/**
 * ESLint configuration for Vue 3 + Vite projects
 * 
 * This file uses the new ESLint Flat Config format (ESLint 9+)
 * which is more flexible and doesn't require parsing JSON
 * 
 * 📚 What is ESLint?
 * ESLint is a tool that finds and fixes problems in your JavaScript/Vue code.
 * Think of it as an "automatic code reviewer" that checks for:
 * - Syntax errors
 * - Code style inconsistencies
 * - Potential bugs
 * - Best practices violations
 * 
 * Example: ESLint will warn if you use `var` instead of `let/const`,
 * or if you don't use semicolons consistently.
 * 
 * 💡 Why use ESLint?
 * - Catches bugs before you run your code
 * - Keeps your code style consistent
 * - Helps team collaboration
 */
export default [
  // Ignore files
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '**/*.test.ts',
      '**/*.spec.ts',
      'coverage/**',
    ],
  },

  // Configuration for Vue and TypeScript files
  {
    files: ['**/*.{vue,ts,js}'],
    languageOptions: {
      parser: vueParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        node: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      vue,
    },
    rules: {
      // Vue-specific rules
      'vue/multi-word-component-names': 'off', // Allow single-word component names
      'vue/no-unused-vars': 'warn', // Warn about unused variables in Vue
      'vue/no-unused-components': 'warn', // Warn about unused components
      'vue/require-default-prop': 'off', // Allow non-default props

      // General best practices
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'prefer-const': 'error', // Use const instead of var/let when possible
      'object-shorthand': 'error', // Use shorthand property syntax
      'semi': ['error', 'always'], // Always use semicolons
    },
  },
];