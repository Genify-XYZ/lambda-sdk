import { Lambda } from '../../src/node/Lambda';
import path from 'path';

describe('Lambda Node Implementation', () => {
  const fixtures = path.join(__dirname, '../fixtures');
  
  describe('uploadFile', () => {
    it('should upload text file', async () => {
      const lambda = new Lambda();
      const filePath = path.join(fixtures, 'files/test.txt');
      const result = await lambda.uploadFile(filePath);
      console.log(JSON.stringify(result, null, 2));
      expect(result.name).toBe('test.txt');
    });

    it('should handle large files', async () => {
      const lambda = new Lambda();
      const filePath = path.join(fixtures, 'files/large.txt');
      const result = await lambda.uploadFile(filePath);
      console.log(JSON.stringify(result, null, 2));
      expect(Number(result.size)).toBeGreaterThan(1000000);
    });
  });

  describe('uploadDirectory', () => {
    it('should upload complete project', async () => {
      const lambda = new Lambda();
      const dirPath = path.join(fixtures, 'directory');
      const result = await lambda.uploadDirectory(dirPath);
      console.log(JSON.stringify(result, null, 2));
      expect(result.files).toHaveLength(4);
    });
  });
});