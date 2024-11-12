import type { LambdaConfig, UploadResponse, ProgressCallback } from '../core/types';
export declare class Lambda {
    private readonly uploadSingleURI;
    private readonly uploadBatchURI;
    private readonly gateway;
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
}
