// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // ─── TypeScript ────────────────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // ─── Estilo general ───────────────────────────────────────────────────
      'curly': ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-return-await': 'off',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],

      // ─── Prettier ─────────────────────────────────────────────────────────
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // ─── Ordenamiento de imports ──────────────────────────────────────────
      // Grupos (en orden):
      //  1. Librerías externas  — @nestjs/*, typeorm, rxjs, class-validator…
      //  2. Path aliases internos — @shared/*, @core/*, @modules/*, @config/*, @database/*
      //  3. Imports relativos   — ./, ../
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Side-effect imports (reflect-metadata, etc.)
            ['^\\u0000'],
            // 2. Librerías externas (node_modules)
            ['^@nestjs', '^typeorm', '^rxjs', '^@?\\w'],
            // 3. Aliases internos del proyecto
            ['^@shared/', '^@core/', '^@modules/', '^@config/', '^@database/'],
            // 4. Imports relativos
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
);
