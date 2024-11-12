"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImagePreview = createImagePreview;
exports.getImageMetadata = getImageMetadata;
exports.createThumbnail = createThumbnail;
const constants_1 = require("../../core/constants");
/**
 * Calculate dimensions maintaining aspect ratio
 */
function calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight, fit = 'contain') {
    const ratio = originalWidth / originalHeight;
    let width = originalWidth;
    let height = originalHeight;
    if (fit === 'contain') {
        if (width > maxWidth) {
            width = maxWidth;
            height = width / ratio;
        }
        if (height > maxHeight) {
            height = maxHeight;
            width = height * ratio;
        }
    }
    else { // cover
        if (ratio > maxWidth / maxHeight) {
            width = maxHeight * ratio;
            height = maxHeight;
        }
        else {
            width = maxWidth;
            height = maxWidth / ratio;
        }
    }
    return { width, height };
}
/**
 * Create image preview
 */
async function createImagePreview(file, options = {}) {
    const { maxWidth = constants_1.FILE_LIMITS.MAX_PREVIEW_DIMENSION, maxHeight = constants_1.FILE_LIMITS.MAX_PREVIEW_DIMENSION, quality = constants_1.FILE_LIMITS.DEFAULT_PREVIEW_QUALITY, format = 'jpeg', fit = 'contain' } = options;
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }
            const { width, height } = calculateDimensions(img.naturalWidth, img.naturalHeight, maxWidth, maxHeight, fit);
            canvas.width = width;
            canvas.height = height;
            // Optional: Add background for transparent images
            if (format === 'jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
            }
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                }
                else {
                    reject(new Error('Failed to create preview'));
                }
            }, `image/${format}`, quality);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };
        img.src = url;
    });
}
/**
 * Get image metadata
 */
async function getImageMetadata(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
                mimeType: file.type,
                size: file.size
            });
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };
        img.src = url;
    });
}
/**
 * Create thumbnail for image
 */
async function createThumbnail(file, size = 100) {
    return createImagePreview(file, {
        maxWidth: size,
        maxHeight: size,
        quality: 0.8,
        format: 'jpeg',
        fit: 'cover'
    });
}
