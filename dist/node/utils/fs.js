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
exports.isDirectory = isDirectory;
exports.prepareDirectory = prepareDirectory;
exports.cleanupFormData = cleanupFormData;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var constants_1 = require("../../core/constants");
/**
 * Check if path exists and is a directory
 */
function isDirectory(path) {
    return __awaiter(this, void 0, void 0, function () {
        var stats, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.default.promises.stat(path)];
                case 1:
                    stats = _b.sent();
                    return [2 /*return*/, stats.isDirectory()];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Prepare directory for upload by creating form data entries
 */
function prepareDirectory(dirPath_1, formData_1, fileIndex_1) {
    return __awaiter(this, arguments, void 0, function (dirPath, formData, fileIndex, stripTLD) {
        function _prepareDirectory(currentPath, formData, dirLTD, currentIndex) {
            return __awaiter(this, void 0, void 0, function () {
                var files, index, _i, files_1, file, filePath, stat, stripedPath, fileStream;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fs_1.default.promises.readdir(currentPath)];
                        case 1:
                            files = _a.sent();
                            index = currentIndex;
                            _i = 0, files_1 = files;
                            _a.label = 2;
                        case 2:
                            if (!(_i < files_1.length)) return [3 /*break*/, 7];
                            file = files_1[_i];
                            if (constants_1.REGEX.FILTERED_FILES.test(file)) {
                                return [3 /*break*/, 6];
                            }
                            filePath = path_1.default.join(currentPath, file);
                            return [4 /*yield*/, fs_1.default.promises.stat(filePath)];
                        case 3:
                            stat = _a.sent();
                            stripedPath = dirLTD ? filePath.replace(dirLTD + path_1.default.sep, '') : filePath;
                            if (!stat.isFile()) return [3 /*break*/, 4];
                            console.log("Processing file:", stripedPath);
                            fileStream = fs_1.default.createReadStream(filePath);
                            formData["file-".concat(index)] = {
                                value: fileStream,
                                options: {
                                    filename: encodeURIComponent(stripedPath),
                                    contentType: 'application/octet-stream',
                                    contentLength: stat.size,
                                },
                            };
                            index++;
                            return [3 /*break*/, 6];
                        case 4:
                            if (!stat.isDirectory()) return [3 /*break*/, 6];
                            return [4 /*yield*/, _prepareDirectory(filePath, formData, dirLTD, index)];
                        case 5:
                            index = _a.sent();
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/, index];
                    }
                });
            });
        }
        var dirLTD;
        if (stripTLD === void 0) { stripTLD = true; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dirLTD = stripTLD ? dirPath : null;
                    return [4 /*yield*/, _prepareDirectory(dirPath, formData, dirLTD, fileIndex)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Clean up form data resources
 */
function cleanupFormData(formData) {
    for (var key in formData) {
        if (formData[key].value && typeof formData[key].value.destroy === 'function') {
            formData[key].value.destroy();
        }
    }
}
