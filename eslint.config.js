import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import lit from 'eslint-plugin-lit'
import wc from 'eslint-plugin-wc'

export default tseslint.config(
  { ignores: ['dist/**', 'mcp/dist/**', 'context/**', 'assets/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  lit.configs['flat/recommended'],
  wc.configs['flat/recommended'],
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // The codebase deliberately uses `cond && fn()` / `cond ? a() : b()` as statements.
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'mcp/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
  },
)
