import fs from 'fs';
import path from 'path';
import { REGEX } from '../../core/constants';
import type { FormDataDict } from '../../core/types';

/**
 * Check if path exists and is a directory
 */
export async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Prepare directory for upload by creating form data entries
 */
export async function prepareDirectory(
  dirPath: string,
  formData: FormDataDict,
  fileIndex: number,
  stripTLD = true
): Promise<number> {
  const dirLTD: string | null = stripTLD ? dirPath : null;

  async function _prepareDirectory(
    currentPath: string,
    formData: FormDataDict,
    dirLTD: string | null,
    currentIndex: number
  ): Promise<number> {
    const files = await fs.promises.readdir(currentPath);
    let index = currentIndex;

    for (const file of files) {
      if (REGEX.FILTERED_FILES.test(file)) {
        continue;
      }

      const filePath = path.join(currentPath, file);
      const stat = await fs.promises.stat(filePath);
      const stripedPath = dirLTD ? filePath.replace(dirLTD + path.sep, '') : filePath;

      if (stat.isFile()) {
        console.log("Processing file:", stripedPath);
        const fileStream = fs.createReadStream(filePath);
        
        formData[`file-${index}`] = {
          value: fileStream,
          options: {
            filename: encodeURIComponent(stripedPath),
            contentType: 'application/octet-stream',
            contentLength: stat.size,
          },
        };
        index++;
      } else if (stat.isDirectory()) {
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
export function cleanupFormData(formData: FormDataDict): void {
  for (const key in formData) {
    if (formData[key].value && typeof formData[key].value.destroy === 'function') {
      formData[key].value.destroy();
    }
  }
}