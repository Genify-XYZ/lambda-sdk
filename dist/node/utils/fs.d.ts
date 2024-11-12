import type { FormDataDict } from '../../core/types';
/**
 * Check if path exists and is a directory
 */
export declare function isDirectory(path: string): Promise<boolean>;
/**
 * Prepare directory for upload by creating form data entries
 */
export declare function prepareDirectory(dirPath: string, formData: FormDataDict, fileIndex: number, stripTLD?: boolean): Promise<number>;
/**
 * Clean up form data resources
 */
export declare function cleanupFormData(formData: FormDataDict): void;
