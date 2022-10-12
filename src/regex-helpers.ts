// Any consecutive string of digits
export const NUM = '\\d+';
// SDP token (see 'token'/'token-char' in https://www.rfc-editor.org/rfc/rfc8866.html#name-sdp-grammar)
export const SDP_TOKEN = "[!#$%&'*+\\-.^_`{|}~a-zA-Z0-9]+";
// Any consecutive non-whitespace token
export const TOKEN = '\\S+';
// A single whitespace
export const SP = '\\s';
// 0 or more whitespace chars
export const WS = '\\w*';
// The rest of the line
export const REST = '.+';
