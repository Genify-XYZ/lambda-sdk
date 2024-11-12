"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTracker = void 0;
exports.createProgressHandler = createProgressHandler;
class ProgressTracker {
    constructor(totalSize, callback) {
        this.totalSize = 0;
        this.uploadedSize = 0;
        this.lastProgress = 0;
        this.totalSize = totalSize;
        this.callback = callback;
    }
    update(chunkSize) {
        var _a;
        this.uploadedSize += chunkSize;
        const currentProgress = Math.round((this.uploadedSize / this.totalSize) * 100);
        if (currentProgress !== this.lastProgress) {
            this.lastProgress = currentProgress;
            (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, currentProgress);
        }
    }
    reset() {
        this.uploadedSize = 0;
        this.lastProgress = 0;
    }
}
exports.ProgressTracker = ProgressTracker;
function createProgressHandler(fileName, fileSize, callback) {
    let uploadedSize = 0;
    let lastProgress = 0;
    return (chunk) => {
        uploadedSize += chunk.length;
        const progress = Math.round((uploadedSize / fileSize) * 100);
        if (progress !== lastProgress) {
            lastProgress = progress;
            callback === null || callback === void 0 ? void 0 : callback(fileName, progress);
        }
    };
}
