import type { LambdaConfig, UploadResponse, ProgressCallback } from '../core/types';
import type { IPFSLsResponse } from '../core/types';
export declare class Lambda {
    private readonly uploadSingleURI;
    private readonly uploadBatchURI;
    private readonly gateway;
    private readonly queryURI;
    constructor(config?: LambdaConfig);
    /**
     * Upload a single file
     */
    uploadFile(file: File, onProgress?: ProgressCallback): Promise<UploadResponse>;
    /**
     * Upload multiple files
     */
    uploadFiles(files: File[], onProgress?: (fileName: string, progress: number) => void): Promise<UploadResponse[]>;
    private handleError;
    /**
     * List contents of an IPFS directory
     * @param hash IPFS hash of the directory
     * @returns Directory contents
     */
    listDirectory(hash: string): Promise<IPFSLsResponse>;
    /**
     * Get simplified directory listing
     * @param hash IPFS hash of the directory
     * @returns Array of files with name, hash, and size
     */
    getDirectoryContents(hash: string): Promise<Array<{
        name: string;
        hash: string;
        size: number;
        type: number;
        target: string;
    }>>;
}
