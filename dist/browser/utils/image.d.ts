import { ImageProcessOptions, ImageMetadata } from '../../core/types';
/**
 * Create image preview
 */
export declare function createImagePreview(file: File, options?: ImageProcessOptions): Promise<Blob>;
/**
 * Get image metadata
 */
export declare function getImageMetadata(file: File): Promise<ImageMetadata>;
/**
 * Create thumbnail for image
 */
export declare function createThumbnail(file: File, size?: number): Promise<Blob>;
