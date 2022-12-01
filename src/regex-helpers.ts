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

// Any consecutive string of digits
export const NUM = '\\d+';
// SDP token (see 'token'/'token-char' in https://www.rfc-editor.org/rfc/rfc8866.html#name-sdp-grammar)
export const SDP_TOKEN = "[!#$%&'*+\\-.^_`{|}~a-zA-Z0-9]+";
// Any consecutive non-whitespace token
export const ANY_NON_WS = '\\S+';
// A single whitespace
export const SP = '\\s';
// 0 or more whitespace chars
export const WS = '\\w*';
// The rest of the line
export const REST = '.+';
