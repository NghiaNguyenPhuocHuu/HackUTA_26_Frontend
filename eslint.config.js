import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist', 'artifacts', 'design', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['src/**/*.{ts,tsx}'], languageOptions: { globals: globals.browser }, plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh }, rules: { ...reactHooks.configs.recommended.rules, 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }] } },
  // Build and QA scripts run in Node, but the Playwright ones also inline
  // page.evaluate callbacks that execute in the browser.
  { files: ['scripts/**/*.{js,mjs,ts}', '*.config.{js,ts}'], languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  { files: ['public/**/*.js'], languageOptions: { globals: globals.browser } },
)
