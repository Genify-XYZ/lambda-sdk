/**
 * Validate file type and size
 */
export declare function validateFile(file: File, allowedTypes?: string[], maxSize?: number): void;
/**
 * Create object URL for preview
 */
export declare function createObjectURL(file: File): string;
/**
 * Revoke object URL
 */
export declare function revokeObjectURL(url: string): void;
