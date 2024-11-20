/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  uploadSingleURI: 'https://lambda.im/upload/api/v0/add',
  queryURI: 'https://lambda.im/upload/api/v0/api/ls',
  uploadBatchURI: 'http://3.0.192.71:5001/api/v0/add?recursive=true&wrap-with-directory=true&pin=true',
  gateway: 'https://lambda.im/lws/',
};

/**
 * File size limits
 */
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_PREVIEW_DIMENSION: 1920,
  DEFAULT_PREVIEW_QUALITY: 0.8,
};


/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds limit',
  UNSUPPORTED_TYPE: 'Unsupported file type',
  UPLOAD_FAILED: 'Upload failed',
  INVALID_FILE: 'Invalid file',
  NO_FILE: 'No file provided',
  DIRECTORY_NOT_FOUND: 'Directory not found',
  INDEX_NOT_FOUND: 'index.html not found in directory',
};

/**
 * Regular expressions
 */
export const REGEX = {
  FILTERED_FILES: /(?:__MACOSX)|(?:\.DS_Store)|(^\.)/,
  IMAGE_FILE: /\.(jpg|jpeg|png|gif|webp)$/i,
};