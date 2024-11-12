/**
 * Default configuration values
 */
export declare const DEFAULT_CONFIG: {
    uploadSingleURI: string;
    uploadBatchURI: string;
    gateway: string;
};
/**
 * File size limits
 */
export declare const FILE_LIMITS: {
    MAX_FILE_SIZE: number;
    MAX_PREVIEW_DIMENSION: number;
    DEFAULT_PREVIEW_QUALITY: number;
};
/**
 * Error messages
 */
export declare const ERROR_MESSAGES: {
    FILE_TOO_LARGE: string;
    UNSUPPORTED_TYPE: string;
    UPLOAD_FAILED: string;
    INVALID_FILE: string;
    NO_FILE: string;
    DIRECTORY_NOT_FOUND: string;
    INDEX_NOT_FOUND: string;
};
/**
 * Regular expressions
 */
export declare const REGEX: {
    FILTERED_FILES: RegExp;
    IMAGE_FILE: RegExp;
};
