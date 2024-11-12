import type { ProgressCallback, FileProgressCallback } from '../../core/types';
export declare class ProgressTracker {
    private totalSize;
    private uploadedSize;
    private lastProgress;
    private callback?;
    constructor(totalSize: number, callback?: ProgressCallback);
    update(chunkSize: number): void;
    reset(): void;
}
export declare function createProgressHandler(fileName: string, fileSize: number, callback?: FileProgressCallback): (chunk: Buffer) => void;
