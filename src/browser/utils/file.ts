import { ERROR_MESSAGES, FILE_LIMITS } from '../../core/constants';

/**
 * Validate file type and size
 */
export function validateFile(
  file: File,
  allowedTypes?: string[],
  maxSize: number = FILE_LIMITS.MAX_FILE_SIZE
): void {
  if (file.size > maxSize) {
    throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE);
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    throw new Error(ERROR_MESSAGES.UNSUPPORTED_TYPE);
  }
}

/**
 * Create object URL for preview
 */
export function createObjectURL(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke object URL
 */
export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}