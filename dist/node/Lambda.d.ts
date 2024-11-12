import { LambdaConfig, UploadResponse, ProgressCallback, FileProgressCallback } from '../core/types';
export declare class Lambda {
    private readonly uploadSingleURI;
    private readonly uploadBatchURI;
    private readonly gateway;
    constructor(config?: LambdaConfig);
    /**
     * Upload a single file
     */
    uploadFile(filePath: string, onProgress?: FileProgressCallback): Promise<UploadResponse>;
    /**
     * Upload a directory
     */
    uploadDirectory(dirPath: string, onProgress?: ProgressCallback, stripTLD?: boolean): Promise<UploadResponse>;
    /**
     * Upload file or directory
     */
    upload(path: string, onProgress?: ProgressCallback, stripTLD?: boolean): Promise<UploadResponse>;
    private handleError;
}
