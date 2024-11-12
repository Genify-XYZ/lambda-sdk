import { ImageProcessOptions, ImageMetadata } from '../../core/types';
import { FILE_LIMITS } from '../../core/constants';

/**
 * Calculate dimensions maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  fit: 'cover' | 'contain' = 'contain'
): { width: number; height: number } {
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
  } else { // cover
    if (ratio > maxWidth / maxHeight) {
      width = maxHeight * ratio;
      height = maxHeight;
    } else {
      width = maxWidth;
      height = maxWidth / ratio;
    }
  }

  return { width, height };
}

/**
 * Create image preview
 */
export async function createImagePreview(
  file: File,
  options: ImageProcessOptions = {}
): Promise<Blob> {
  const {
    maxWidth = FILE_LIMITS.MAX_PREVIEW_DIMENSION,
    maxHeight = FILE_LIMITS.MAX_PREVIEW_DIMENSION,
    quality = FILE_LIMITS.DEFAULT_PREVIEW_QUALITY,
    format = 'jpeg',
    fit = 'contain'
  } = options;

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

      const { width, height } = calculateDimensions(
        img.naturalWidth,
        img.naturalHeight,
        maxWidth,
        maxHeight,
        fit
      );

      canvas.width = width;
      canvas.height = height;

      // Optional: Add background for transparent images
      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create preview'));
          }
        },
        `image/${format}`,
        quality
      );
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
export async function getImageMetadata(file: File): Promise<ImageMetadata> {
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
export async function createThumbnail(
  file: File,
  size: number = 100
): Promise<Blob> {
  return createImagePreview(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.8,
    format: 'jpeg',
    fit: 'cover'
  });
}