"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFile = validateFile;
exports.createObjectURL = createObjectURL;
exports.revokeObjectURL = revokeObjectURL;
var constants_1 = require("../../core/constants");
/**
 * Validate file type and size
 */
function validateFile(file, allowedTypes, maxSize) {
    if (maxSize === void 0) { maxSize = constants_1.FILE_LIMITS.MAX_FILE_SIZE; }
    if (file.size > maxSize) {
        throw new Error(constants_1.ERROR_MESSAGES.FILE_TOO_LARGE);
    }
    if (allowedTypes && !allowedTypes.includes(file.type)) {
        throw new Error(constants_1.ERROR_MESSAGES.UNSUPPORTED_TYPE);
    }
}
/**
 * Create object URL for preview
 */
function createObjectURL(file) {
    return URL.createObjectURL(file);
}
/**
 * Revoke object URL
 */
function revokeObjectURL(url) {
    URL.revokeObjectURL(url);
}
