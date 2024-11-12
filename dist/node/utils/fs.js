"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDirectory = isDirectory;
exports.prepareDirectory = prepareDirectory;
exports.cleanupFormData = cleanupFormData;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../../core/constants");
/**
 * Check if path exists and is a directory
 */
async function isDirectory(path) {
    try {
        const stats = await fs_1.default.promises.stat(path);
        return stats.isDirectory();
    }
    catch (_a) {
        return false;
    }
}
/**
 * Prepare directory for upload by creating form data entries
 */
async function prepareDirectory(dirPath, formData, fileIndex, stripTLD = true) {
    const dirLTD = stripTLD ? dirPath : null;
    async function _prepareDirectory(currentPath, formData, dirLTD, currentIndex) {
        const files = await fs_1.default.promises.readdir(currentPath);
        let index = currentIndex;
        for (const file of files) {
            if (constants_1.REGEX.FILTERED_FILES.test(file)) {
                continue;
            }
            const filePath = path_1.default.join(currentPath, file);
            const stat = await fs_1.default.promises.stat(filePath);
            const stripedPath = dirLTD ? filePath.replace(dirLTD + path_1.default.sep, '') : filePath;
            if (stat.isFile()) {
                console.log("Processing file:", stripedPath);
                const fileStream = fs_1.default.createReadStream(filePath);
                formData[`file-${index}`] = {
                    value: fileStream,
                    options: {
                        filename: encodeURIComponent(stripedPath),
                        contentType: 'application/octet-stream',
                        contentLength: stat.size,
                    },
                };
                index++;
            }
            else if (stat.isDirectory()) {
                index = await _prepareDirectory(filePath, formData, dirLTD, index);
            }
        }
        return index;
    }
    return await _prepareDirectory(dirPath, formData, dirLTD, fileIndex);
}
/**
 * Clean up form data resources
 */
function cleanupFormData(formData) {
    for (const key in formData) {
        if (formData[key].value && typeof formData[key].value.destroy === 'function') {
            formData[key].value.destroy();
        }
    }
}
