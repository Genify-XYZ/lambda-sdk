"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var form_data_1 = __importDefault(require("form-data"));
var constants_1 = require("../core/constants");
var fs_2 = require("./utils/fs");
var progress_1 = require("./utils/progress");
var Lambda = /** @class */ (function () {
    function Lambda(config) {
        if (config === void 0) { config = {}; }
        this.uploadSingleURI = config.uploadSingleURI || constants_1.DEFAULT_CONFIG.uploadSingleURI;
        this.uploadBatchURI = config.uploadBatchURI || constants_1.DEFAULT_CONFIG.uploadBatchURI;
        this.queryURI = config.queryURI || constants_1.DEFAULT_CONFIG.queryURI;
        this.gateway = config.gateway || constants_1.DEFAULT_CONFIG.gateway;
    }
    /**
     * Upload a single file
     */
    Lambda.prototype.uploadFile = function (filePath, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            var file, stat, filename, formData, progressHandler, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!fs_1.default.existsSync(filePath)) {
                            throw new Error(constants_1.ERROR_MESSAGES.INVALID_FILE);
                        }
                        file = fs_1.default.createReadStream(filePath);
                        stat = fs_1.default.statSync(filePath);
                        filename = path_1.default.basename(filePath);
                        formData = new form_data_1.default();
                        formData.append('file', file, {
                            filename: encodeURIComponent(filename),
                            contentType: 'application/octet-stream',
                            knownLength: stat.size
                        });
                        progressHandler = onProgress && (0, progress_1.createProgressHandler)(filename, stat.size, onProgress);
                        if (progressHandler) {
                            file.on('data', progressHandler);
                        }
                        return [4 /*yield*/, axios_1.default.post(this.uploadSingleURI, formData, {
                                headers: formData.getHeaders(),
                                maxBodyLength: Infinity,
                                timeout: 1000 * 60 * 60 // 1 hour
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                hash: response.data.Hash,
                                url: this.gateway + response.data.Hash,
                                size: response.data.Size,
                                name: filename
                            }];
                    case 2:
                        error_1 = _a.sent();
                        throw this.handleError(error_1, "Failed to upload file: ".concat(filePath));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upload a directory
     */
    Lambda.prototype.uploadDirectory = function (dirPath_1, onProgress_1) {
        return __awaiter(this, arguments, void 0, function (dirPath, onProgress, stripTLD) {
            var formData, fileIndex, totalSize, key, progressTracker_1, axiosFormData, key, file, response, data, handledString, files, dirResp, dirHash, error_2;
            if (stripTLD === void 0) { stripTLD = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, (0, fs_2.isDirectory)(dirPath)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error(constants_1.ERROR_MESSAGES.DIRECTORY_NOT_FOUND);
                        }
                        formData = {};
                        fileIndex = 0;
                        return [4 /*yield*/, (0, fs_2.prepareDirectory)(dirPath, formData, fileIndex, stripTLD)];
                    case 2:
                        // Prepare directory for upload
                        fileIndex = _a.sent();
                        totalSize = 0;
                        for (key in formData) {
                            totalSize += formData[key].options.contentLength;
                        }
                        progressTracker_1 = new progress_1.ProgressTracker(totalSize, onProgress);
                        axiosFormData = new form_data_1.default();
                        for (key in formData) {
                            file = formData[key];
                            file.value.on('data', function (chunk) { return progressTracker_1.update(chunk.length); });
                            axiosFormData.append(key, file.value, file.options);
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, , 5, 6]);
                        return [4 /*yield*/, axios_1.default.post(this.uploadBatchURI, axiosFormData, {
                                headers: axiosFormData.getHeaders(),
                                maxBodyLength: Infinity,
                                timeout: 1000 * 60 * 60
                            })];
                    case 4:
                        response = _a.sent();
                        data = response.data.replace(/}/g, '},');
                        handledString = '[' + data.slice(0, data.length - 2) + ']';
                        files = JSON.parse(handledString);
                        dirResp = files.find(function (file) { return file.Name === ''; });
                        dirHash = dirResp.Hash;
                        files = files.filter(function (file) { return file.Name !== ''; });
                        return [2 /*return*/, {
                                hash: dirHash,
                                url: this.gateway + dirHash,
                                name: path_1.default.basename(dirPath),
                                size: dirResp.Size,
                                files: files.map(function (file) { return ({
                                    Name: file.Name,
                                    Hash: file.Hash,
                                    Size: file.Size
                                }); })
                            }];
                    case 5:
                        (0, fs_2.cleanupFormData)(formData);
                        return [7 /*endfinally*/];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        throw this.handleError(error_2, "Failed to upload directory: ".concat(dirPath));
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upload file or directory
     */
    Lambda.prototype.upload = function (path_2, onProgress_1) {
        return __awaiter(this, arguments, void 0, function (path, onProgress, stripTLD) {
            var stats, error_3;
            if (stripTLD === void 0) { stripTLD = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, fs_1.default.promises.stat(path)];
                    case 1:
                        stats = _a.sent();
                        if (!stats.isFile()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.uploadFile(path, function (_, progress) {
                                if (onProgress)
                                    onProgress(progress);
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, this.uploadDirectory(path, onProgress, stripTLD)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        throw this.handleError(error_3, "Failed to upload: ".concat(path));
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Lambda.prototype.handleError = function (error, message) {
        console.error(message, error);
        if (error instanceof Error) {
            return new Error("".concat(message, ": ").concat(error.message));
        }
        return new Error(message);
    };
    /**
     * List contents of an IPFS directory
     * @param hash IPFS hash of the directory
     * @returns Directory contents
     */
    Lambda.prototype.listDirectory = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.queryURI, "?arg=").concat(hash))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_4 = _a.sent();
                        throw new Error("Failed to list directory: ".concat(hash));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get simplified directory listing
     * @param hash IPFS hash of the directory
     * @returns Array of files with name, hash, and size
     */
    Lambda.prototype.getDirectoryContents = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.listDirectory(hash)];
                    case 1:
                        response = _c.sent();
                        if (!((_b = (_a = response.Objects) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.Links)) {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, response.Objects[0].Links.map(function (link) { return ({
                                name: link.Name,
                                hash: link.Hash,
                                size: link.Size,
                                type: link.Type,
                                target: link.Target
                            }); })];
                }
            });
        });
    };
    return Lambda;
}());
exports.Lambda = Lambda;
