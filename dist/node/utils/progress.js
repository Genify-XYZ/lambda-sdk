"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTracker = void 0;
exports.createProgressHandler = createProgressHandler;
var ProgressTracker = /** @class */ (function () {
    function ProgressTracker(totalSize, callback) {
        this.totalSize = 0;
        this.uploadedSize = 0;
        this.lastProgress = 0;
        this.totalSize = totalSize;
        this.callback = callback;
    }
    ProgressTracker.prototype.update = function (chunkSize) {
        var _a;
        this.uploadedSize += chunkSize;
        var currentProgress = Math.round((this.uploadedSize / this.totalSize) * 100);
        if (currentProgress !== this.lastProgress) {
            this.lastProgress = currentProgress;
            (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, currentProgress);
        }
    };
    ProgressTracker.prototype.reset = function () {
        this.uploadedSize = 0;
        this.lastProgress = 0;
    };
    return ProgressTracker;
}());
exports.ProgressTracker = ProgressTracker;
function createProgressHandler(fileName, fileSize, callback) {
    var uploadedSize = 0;
    var lastProgress = 0;
    return function (chunk) {
        uploadedSize += chunk.length;
        var progress = Math.round((uploadedSize / fileSize) * 100);
        if (progress !== lastProgress) {
            lastProgress = progress;
            callback === null || callback === void 0 ? void 0 : callback(fileName, progress);
        }
    };
}
