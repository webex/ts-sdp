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

import { AvMediaDescription, CodecInfo } from './model';

/**
 * Check if the given codec is present in the given mline.
 *
 * @param codecName - The string name of the codec to check for (case insensitive).
 * @param mLine - The mline to search for the given codec.
 * @returns True if the codec is present, false otherwise.
 */
export function hasCodec(codecName: string, mLine: AvMediaDescription): boolean {
  return [...mLine.codecs.values()].some(
    (ci: CodecInfo) => ci.name?.toLowerCase() === codecName.toLowerCase()
  );
}
