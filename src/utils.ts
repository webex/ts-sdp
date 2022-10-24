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
