"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const form_data_1 = __importDefault(require("form-data"));
const constants_1 = require("../core/constants");
const fs_2 = require("./utils/fs");
const progress_1 = require("./utils/progress");
class Lambda {
    constructor(config = {}) {
        this.uploadSingleURI = config.uploadSingleURI || constants_1.DEFAULT_CONFIG.uploadSingleURI;
        this.uploadBatchURI = config.uploadBatchURI || constants_1.DEFAULT_CONFIG.uploadBatchURI;
        this.queryURI = config.queryURI || constants_1.DEFAULT_CONFIG.queryURI;
        this.gateway = config.gateway || constants_1.DEFAULT_CONFIG.gateway;
    }
    /**
     * Upload a single file
     */
    async uploadFile(filePath, onProgress) {
        try {
            if (!fs_1.default.existsSync(filePath)) {
                throw new Error(constants_1.ERROR_MESSAGES.INVALID_FILE);
            }
            const file = fs_1.default.createReadStream(filePath);
            const stat = fs_1.default.statSync(filePath);
            const filename = path_1.default.basename(filePath);
            const formData = new form_data_1.default();
            formData.append('file', file, {
                filename: encodeURIComponent(filename),
                contentType: 'application/octet-stream',
                knownLength: stat.size
            });
            const progressHandler = onProgress && (0, progress_1.createProgressHandler)(filename, stat.size, onProgress);
            if (progressHandler) {
                file.on('data', progressHandler);
            }
            const response = await axios_1.default.post(this.uploadSingleURI, formData, {
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
        }
        catch (error) {
            throw this.handleError(error, `Failed to upload file: ${filePath}`);
        }
    }
    /**
     * Upload a directory
     */
    async uploadDirectory(dirPath, onProgress, stripTLD = true) {
        try {
            if (!await (0, fs_2.isDirectory)(dirPath)) {
                throw new Error(constants_1.ERROR_MESSAGES.DIRECTORY_NOT_FOUND);
            }
            const formData = {};
            let fileIndex = 0;
            // Prepare directory for upload
            fileIndex = await (0, fs_2.prepareDirectory)(dirPath, formData, fileIndex, stripTLD);
            // Calculate total size
            let totalSize = 0;
            for (const key in formData) {
                totalSize += formData[key].options.contentLength;
            }
            // Create progress tracker
            const progressTracker = new progress_1.ProgressTracker(totalSize, onProgress);
            // Create form data for axios
            const axiosFormData = new form_data_1.default();
            for (const key in formData) {
                const file = formData[key];
                file.value.on('data', (chunk) => progressTracker.update(chunk.length));
                axiosFormData.append(key, file.value, file.options);
            }
            try {
                const response = await axios_1.default.post(this.uploadBatchURI, axiosFormData, {
                    headers: axiosFormData.getHeaders(),
                    maxBodyLength: Infinity,
                    timeout: 1000 * 60 * 60
                });
                // Parse response
                let data = response.data.replace(/}/g, '},');
                let handledString = '[' + data.slice(0, data.length - 2) + ']';
                let files = JSON.parse(handledString);
                const dirResp = files.find((file) => file.Name === '');
                const dirHash = dirResp.Hash;
                files = files.filter((file) => file.Name !== '');
                return {
                    hash: dirHash,
                    url: this.gateway + dirHash,
                    name: path_1.default.basename(dirPath),
                    size: dirResp.Size,
                    files: files.map((file) => ({
                        Name: file.Name,
                        Hash: file.Hash,
                        Size: file.Size
                    }))
                };
            }
            finally {
                (0, fs_2.cleanupFormData)(formData);
            }
        }
        catch (error) {
            throw this.handleError(error, `Failed to upload directory: ${dirPath}`);
        }
    }
    /**
     * Upload file or directory
     */
    async upload(path, onProgress, stripTLD = true) {
        try {
            const stats = await fs_1.default.promises.stat(path);
            if (stats.isFile()) {
                return await this.uploadFile(path, (_, progress) => {
                    if (onProgress)
                        onProgress(progress);
                });
            }
            else {
                return await this.uploadDirectory(path, onProgress, stripTLD);
            }
        }
        catch (error) {
            throw this.handleError(error, `Failed to upload: ${path}`);
        }
    }
    handleError(error, message) {
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
    async listDirectory(hash) {
        try {
            const response = await axios_1.default.post(`${this.queryURI}?arg=${hash}`);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to list directory: ${hash}`);
        }
    }
    /**
     * Get simplified directory listing
     * @param hash IPFS hash of the directory
     * @returns Array of files with name, hash, and size
     */
    async getDirectoryContents(hash) {
        var _a, _b;
        const response = await this.listDirectory(hash);
        if (!((_b = (_a = response.Objects) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.Links)) {
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
exports.Lambda = Lambda;
