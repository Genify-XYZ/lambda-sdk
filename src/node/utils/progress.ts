import type { ProgressCallback, FileProgressCallback } from '../../core/types';

export class ProgressTracker {
  private totalSize: number = 0;
  private uploadedSize: number = 0;
  private lastProgress: number = 0;
  private callback?: ProgressCallback;

  constructor(totalSize: number, callback?: ProgressCallback) {
    this.totalSize = totalSize;
    this.callback = callback;
  }

  update(chunkSize: number): void {
    this.uploadedSize += chunkSize;
    const currentProgress = Math.round((this.uploadedSize / this.totalSize) * 100);
    
    if (currentProgress !== this.lastProgress) {
      this.lastProgress = currentProgress;
      this.callback?.(currentProgress);
    }
  }

  reset(): void {
    this.uploadedSize = 0;
    this.lastProgress = 0;
  }
}

export function createProgressHandler(
  fileName: string,
  fileSize: number,
  callback?: FileProgressCallback
): (chunk: Buffer) => void {
  let uploadedSize = 0;
  let lastProgress = 0;

  return (chunk: Buffer) => {
    uploadedSize += chunk.length;
    const progress = Math.round((uploadedSize / fileSize) * 100);
    
    if (progress !== lastProgress) {
      lastProgress = progress;
      callback?.(fileName, progress);
    }
  };
}