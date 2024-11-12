"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../core/constants");
const file_1 = require("./utils/file");
class Lambda {
    constructor(config = {}) {
        this.uploadSingleURI = config.uploadSingleURI || constants_1.DEFAULT_CONFIG.uploadSingleURI;
        this.uploadBatchURI = config.uploadBatchURI || constants_1.DEFAULT_CONFIG.uploadBatchURI;
        this.gateway = config.gateway || constants_1.DEFAULT_CONFIG.gateway;
    }
    /**
     * Upload a single file
     */
    async uploadFile(file, onProgress) {
        try {
            (0, file_1.validateFile)(file);
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios_1.default.post(this.uploadSingleURI, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
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
        }
        catch (error) {
            throw this.handleError(error, `Failed to upload file: ${file.name}`);
        }
    }
    /**
     * Upload multiple files
     */
    async uploadFiles(files, onProgress) {
        const results = [];
        for (const file of files) {
            const result = await this.uploadFile(file, (progress) => onProgress === null || onProgress === void 0 ? void 0 : onProgress(file.name, progress));
            results.push(result);
        }
        return results;
    }
    handleError(error, message) {
        console.error(message, error);
        if (error instanceof Error) {
            return new Error(`${message}: ${error.message}`);
        }
        return new Error(message);
    }
}
exports.Lambda = Lambda;
