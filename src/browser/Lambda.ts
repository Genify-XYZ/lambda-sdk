import axios from 'axios';
import type {
  LambdaConfig,
  UploadResponse,
  ProgressCallback,
} from '../core/types';
import { DEFAULT_CONFIG } from '../core/constants';
import { validateFile } from './utils/file';
import type { IPFSLsResponse } from '../core/types';

export class Lambda {
  private readonly uploadSingleURI: string;
  private readonly uploadBatchURI: string;
  private readonly gateway: string;
  private readonly queryURI: string;

  constructor(config: LambdaConfig = {}) {
    this.uploadSingleURI = config.uploadSingleURI || DEFAULT_CONFIG.uploadSingleURI;
    this.uploadBatchURI = config.uploadBatchURI || DEFAULT_CONFIG.uploadBatchURI;
    this.gateway = config.gateway || DEFAULT_CONFIG.gateway;
    this.queryURI = config.queryURI || DEFAULT_CONFIG.queryURI;
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
      const fileName = file.webkitRelativePath ?
        file.webkitRelativePath.split('/').pop() :
        file.name

      formData.append('file', file, fileName);

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

      const responseText = response.data
      const jsonObjects = responseText.match(/{[^}]+}/g)

      if (!jsonObjects) {
        throw new Error('Invalid response format')
      }
      const fileJson = JSON.parse(jsonObjects[0])
      return {
        hash: fileJson.Hash,
        url: this.gateway + fileJson.Hash,
        size: fileJson.Size,
        name: fileName || ''
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


  /**
   * List contents of an IPFS directory
   * @param hash IPFS hash of the directory
   * @returns Directory contents
   */
  async listDirectory(hash: string): Promise<IPFSLsResponse> {
    try {
      const response = await axios.post(
        `${this.queryURI}?arg=${hash}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to list directory: ${hash}`);
    }
  }

  /**
   * Get simplified directory listing
   * @param hash IPFS hash of the directory
   * @returns Array of files with name, hash, and size
   */
  async getDirectoryContents(hash: string): Promise<Array<{
    name: string;
    hash: string;
    size: number;
    type: number;
    target: string
  }>> {

    const response = await this.listDirectory(hash);
    if (!response.Objects?.[0]?.Links) {
      return [];
    }

    return response.Objects[0].Links.map(link => ({
      name: link.Name,
      hash: link.Hash,
      size: link.Size,
      type: link.Type,
      target: link.Target
    }));
  }
}

