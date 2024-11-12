import axios from 'axios';
import type { 
  LambdaConfig, 
  UploadResponse, 
  ProgressCallback,
} from '../core/types';
import { DEFAULT_CONFIG } from '../core/constants';
import { validateFile } from './utils/file';

export class Lambda {
  private readonly uploadSingleURI: string;
  private readonly uploadBatchURI: string;
  private readonly gateway: string;

  constructor(config: LambdaConfig = {}) {
    this.uploadSingleURI = config.uploadSingleURI || DEFAULT_CONFIG.uploadSingleURI;
    this.uploadBatchURI = config.uploadBatchURI || DEFAULT_CONFIG.uploadBatchURI;
    this.gateway = config.gateway || DEFAULT_CONFIG.gateway;
  }

  /**
   * Upload a single file
   */
  async uploadFile(
    file: File,
    onProgress?: ProgressCallback
  ): Promise<UploadResponse> {
    try {
      validateFile(file);

      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(this.uploadSingleURI, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            onProgress(progress);
          }
        }
      });

      return {
        hash: response.data.Hash,
        url: this.gateway + response.data.Hash,
        size: response.data.Size,
        name: file.name
      };
    } catch (error) {
      throw this.handleError(error, `Failed to upload file: ${file.name}`);
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: File[],
    onProgress?: (fileName: string, progress: number) => void
  ): Promise<UploadResponse[]> {
    const results: UploadResponse[] = [];
    
    for (const file of files) {
      const result = await this.uploadFile(
        file,
        (progress) => onProgress?.(file.name, progress)
      );
      results.push(result);
    }

    return results;
  }

  private handleError(error: unknown, message: string): Error {
    console.error(message, error);
    if (error instanceof Error) {
      return new Error(`${message}: ${error.message}`);
    }
    return new Error(message);
  }
}