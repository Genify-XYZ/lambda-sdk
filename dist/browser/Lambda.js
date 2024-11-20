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
var constants_1 = require("../core/constants");
var file_1 = require("./utils/file");
var Lambda = /** @class */ (function () {
    function Lambda(config) {
        if (config === void 0) { config = {}; }
        this.uploadSingleURI = config.uploadSingleURI || constants_1.DEFAULT_CONFIG.uploadSingleURI;
        this.uploadBatchURI = config.uploadBatchURI || constants_1.DEFAULT_CONFIG.uploadBatchURI;
        this.gateway = config.gateway || constants_1.DEFAULT_CONFIG.gateway;
        this.queryURI = config.queryURI || constants_1.DEFAULT_CONFIG.queryURI;
    }
    /**
     * Upload a single file
     */
    Lambda.prototype.uploadFile = function (file, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        (0, file_1.validateFile)(file);
                        formData = new FormData();
                        formData.append('file', file);
                        return [4 /*yield*/, axios_1.default.post(this.uploadSingleURI, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                },
                                onUploadProgress: function (progressEvent) {
                                    if (onProgress && progressEvent.total) {
                                        var progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                        onProgress(progress);
                                    }
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                hash: response.data.Hash,
                                url: this.gateway + response.data.Hash,
                                size: response.data.Size,
                                name: file.name
                            }];
                    case 2:
                        error_1 = _a.sent();
                        throw this.handleError(error_1, "Failed to upload file: ".concat(file.name));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upload multiple files
     */
    Lambda.prototype.uploadFiles = function (files, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _loop_1, this_1, _i, files_1, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        _loop_1 = function (file) {
                            var result;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this_1.uploadFile(file, function (progress) { return onProgress === null || onProgress === void 0 ? void 0 : onProgress(file.name, progress); })];
                                    case 1:
                                        result = _b.sent();
                                        results.push(result);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, files_1 = files;
                        _a.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 4];
                        file = files_1[_i];
                        return [5 /*yield**/, _loop_1(file)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
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
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.queryURI, "?arg=").concat(hash))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_2 = _a.sent();
                        throw this.handleError(error_2, "Failed to list directory: ".concat(hash));
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
