import { Lambda } from '../../src/browser/Lambda';
import path from 'path';
import fs from 'fs';

describe('Lambda Browser Implementation', () => {
  const fixtures = path.join(__dirname, '../fixtures');
  let lambda: Lambda;

  beforeEach(() => {
    lambda = new Lambda();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const filePath = path.join(fixtures, 'files/test.txt');
      const content = await fs.promises.readFile(filePath);

      const arrayBuffer = content.buffer.slice(
        content.byteOffset,
        content.byteOffset + content.byteLength
      );

      const file = new File([arrayBuffer], 'test.txt', {
        type: 'text/plain'
      });

      const result = await lambda.uploadFile(file);

      console.log(JSON.stringify(result, null, 2));
      expect(result.name).toBe('test.txt');
    });

    it('should upload a file with webkitRelativePath successfully', async () => {
      const webkitRelativePath = 'files/test.txt';
      const filePath = path.join(fixtures, 'files/test.txt');
      const content = await fs.promises.readFile(filePath);

      const arrayBuffer = content.buffer.slice(
        content.byteOffset,
        content.byteOffset + content.byteLength
      );

      const file = new File([arrayBuffer], 'test.txt', {
        type: 'text/plain'
      });

      Object.defineProperty(file, 'webkitRelativePath', {
        value: webkitRelativePath,
        writable: false
      });

      const result = await lambda.uploadFile(file);

      console.log(JSON.stringify(result, null, 2));
      expect(result.name).toBe('test.txt');
    });

    it('should handle large files', async () => {
      const filePath = path.join(fixtures, 'files/large.txt');
      const content = await fs.promises.readFile(filePath);
      const arrayBuffer = content.buffer.slice(
        content.byteOffset,
        content.byteOffset + content.byteLength
      );

      const file = new File([arrayBuffer], 'large.txt', {
        type: 'text/plain'
      });

      const result = await lambda.uploadFile(file);
      console.log(JSON.stringify(result, null, 2));
      expect(Number(result.size)).toBeGreaterThan(1000000);
    });
  });
});