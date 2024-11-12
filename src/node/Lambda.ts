import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import {
  LambdaConfig,
  UploadResponse,
  FormDataDict,
  ProgressCallback,
  FileProgressCallback
} from '../core/types';
import { DEFAULT_CONFIG, ERROR_MESSAGES } from '../core/constants';
import { isDirectory, prepareDirectory, cleanupFormData } from './utils/fs';
import { ProgressTracker, createProgressHandler } from './utils/progress';

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
    filePath: string,
    onProgress?: FileProgressCallback
  ): Promise<UploadResponse> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(ERROR_MESSAGES.INVALID_FILE);
      }

      const file = fs.createReadStream(filePath);
      const stat = fs.statSync(filePath);
      const filename = path.basename(filePath);
      const formData = new FormData();

      formData.append('file', file, {
        filename: encodeURIComponent(filename),
        contentType: 'application/octet-stream',
        knownLength: stat.size
      });

      const progressHandler = onProgress && createProgressHandler(filename, stat.size, onProgress);
      if (progressHandler) {
        file.on('data', progressHandler);
      }

      const response = await axios.post(this.uploadSingleURI, formData, {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        timeout: 1000 * 60 * 60 // 1 hour
      });

      return {
        hash: response.data.Hash,
        url: this.gateway + response.data.Hash,
        size: response.data.Size,
        name: filename
      };
    } catch (error) {
      throw this.handleError(error, `Failed to upload file: ${filePath}`);
    }
  }

  /**
   * Upload a directory
   */
  async uploadDirectory(
    dirPath: string,
    onProgress?: ProgressCallback,
    stripTLD = true
  ): Promise<UploadResponse> {
    try {
      if (!await isDirectory(dirPath)) {
        throw new Error(ERROR_MESSAGES.DIRECTORY_NOT_FOUND);
      }

      const formData: FormDataDict = {};
      let fileIndex = 0;

      // Prepare directory for upload
      fileIndex = await prepareDirectory(dirPath, formData, fileIndex, stripTLD);

      // Calculate total size
      let totalSize = 0;
      for (const key in formData) {
        totalSize += formData[key].options.contentLength;
      }

      // Create progress tracker
      const progressTracker = new ProgressTracker(totalSize, onProgress);

      // Create form data for axios
      const axiosFormData = new FormData();
      for (const key in formData) {
        const file = formData[key];
        file.value.on('data', (chunk: Buffer) => progressTracker.update(chunk.length));
        axiosFormData.append(key, file.value, file.options);
      }

      try {
        const response = await axios.post(this.uploadBatchURI, axiosFormData, {
          headers: axiosFormData.getHeaders(),
          maxBodyLength: Infinity,
          timeout: 1000 * 60 * 60
        });

        // Parse response
        let data = response.data.replace(/}/g, '},');
        let handledString = '[' + data.slice(0, data.length - 2) + ']';
        let files = JSON.parse(handledString);

        const dirResp = files.find((file: any) => file.Name === '');
        const dirHash = dirResp.Hash;
        files = files.filter((file: any) => file.Name !== '');

        return {
          hash: dirHash,
          url: this.gateway + dirHash,
          name: path.basename(dirPath),
          size: dirResp.Size,
          files: files.map((file: any) => ({
            Name: file.Name,
            Hash: file.Hash,
            Size: file.Size
          }))
        };
      } finally {
        cleanupFormData(formData);
      }
    } catch (error) {
      throw this.handleError(error, `Failed to upload directory: ${dirPath}`);
    }
  }

  /**
   * Upload file or directory
   */
  async upload(
    path: string,
    onProgress?: ProgressCallback,
    stripTLD = true
  ): Promise<UploadResponse> {
    try {
      const stats = await fs.promises.stat(path);

      if (stats.isFile()) {
        return await this.uploadFile(path, (_, progress) => {
          if (onProgress) onProgress(progress);
        });
      } else {
        return await this.uploadDirectory(path, onProgress, stripTLD);
      }
    } catch (error) {
      throw this.handleError(error, `Failed to upload: ${path}`);
    }
  }

  private handleError(error: unknown, message: string): Error {
    console.error(message, error);
    if (error instanceof Error) {
      return new Error(`${message}: ${error.message}`);
    }
    return new Error(message);
  }
}