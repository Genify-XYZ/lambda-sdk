/**
 * Lambda service configuration options
 */
export interface LambdaConfig {
    /** Single file upload endpoint */
    uploadSingleURI?: string;
    /** Batch upload endpoint */
    uploadBatchURI?: string;
    /** Gateway URL prefix */
    gateway?: string;
}
/**
 * Basic upload response interface
 */
export interface UploadResponse {
    /** IPFS hash of the uploaded content */
    hash: string;
    /** Complete gateway URL */
    url: string;
    /** File size in bytes */
    size: number;
    /** Original file name */
    name: string;
    /** Array of files (for directory uploads) */
    files?: Array<{
        Name: string;
        Hash: string;
        Size: number;
    }>;
}
/**
 * Progress callback types
 */
export type ProgressCallback = (progress: number) => void;
export type FileProgressCallback = (fileName: string, progress: number) => void;
/**
 * Form data file interface for Node.js
 */
export interface FormDataFile {
    value: any;
    options: {
        filename: string;
        contentType: string;
        contentLength: number;
    };
}
/**
 * Form data dictionary interface
 */
export interface FormDataDict {
    [key: string]: FormDataFile;
}
