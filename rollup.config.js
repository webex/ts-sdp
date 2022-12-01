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

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import execute from 'rollup-plugin-execute';
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'esm',
        dir: 'dist/esm',
      },
      {
        format: 'cjs',
        dir: 'dist/cjs',
      },
    ],
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
      resolve({ browser: true, extensions: ['.js', '.ts'] }),
      commonjs(),
    ],
    watch: {
      include: 'src/**',
    },
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'es',
      file: 'dist/types.d.ts',
    },
    plugins: [dts(), execute(['rm -rf dist/types/*', 'mv dist/types.d.ts dist/types/index.d.ts'])],
    watch: true,
  },
];
