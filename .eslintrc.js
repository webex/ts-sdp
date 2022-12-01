/*
 * Copyright 2022 Cisco
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/all',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist/**', 'docs/**', 'testbed/**', 'src/**/*.js', 'scripts/*.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'jest', 'jsdoc', 'prettier'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/prefer-default-export': 0,
    'jest/no-hooks': [
      'error',
      {
        allow: ['afterAll', 'afterEach', 'beforeAll', 'beforeEach'],
      },
    ],
    'jest/lowercase-name': 0,
    'jest/require-hook': 0,
    'jsdoc/check-tag-names': [
      1,
      {
        definedTags: [
          'alpha',
          'beta',
          'defaultValue',
          'deprecated',
          'eventProperty',
          'example',
          'inheritDoc',
          'internal',
          'link',
          'override',
          'packageDocumentation',
          'param',
          'preapproved',
          'preivateRemarks',
          'public',
          'readonly',
          'remarks',
          'returns',
          'sealed',
          'typeParam',
          'virtual',
        ],
      },
    ],
    'jsdoc/no-types': 1,
    'jsdoc/no-undefined-types': 0,
    'jsdoc/require-description': 1,
    'jsdoc/require-description-complete-sentence': 1,
    'jsdoc/require-hyphen-before-param-description': 1,
    'jsdoc/require-jsdoc': [
      2,
      {
        require: {
          ArrowFunctionExpression: true,
          ClassDeclaration: true,
          ClassExpression: true,
          FunctionDeclaration: true,
          FunctionExpression: true,
          MethodDefinition: true,
        },
      },
    ],
    'jsdoc/require-param-type': 0,
    'jsdoc/require-returns-type': 0,
    'jsdoc/valid-types': 1,
    'no-underscore-dangle': 0,
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': ['error'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.js', '.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
        paths: ['src'],
      },
    },
  },
};
