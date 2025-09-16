// eslint.config.js
import eslintPluginImport from 'eslint-plugin-import'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['node_modules', 'dist', 'build'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node, // Ambiente Node.js
      },
    },

    plugins: {
      import: eslintPluginImport,
    },

    rules: {
      // Regras básicas
      'no-unused-vars': 'warn',
      'no-console': 'off',

      // Importações
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'import/no-duplicates': 'error',

      // Estilo de código (deixe o Prettier cuidar do resto)
      semi: false,
      quotes: ['error', 'single'],
    },
  },

  // Se tiver TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [...tseslint.configs.recommended, ...tseslint.configs.stylistic],
  },
]
