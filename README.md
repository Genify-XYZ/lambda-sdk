# Lambda SDK

A TypeScript SDK for file uploads and IPFS integration.

## Installation

```bash
npm install @genify/lambda-sdk
```

## Usage

### Browser Environment

```typescript
import { Lambda } from '@genify/lambda-sdk';

// Initialize Lambda with custom configuration
const lambda = new Lambda({
  uploadSingleURI: 'your-upload-endpoint',
  gateway: 'your-gateway-url'
});

// Upload a single file
const file = new File(['content'], 'example.txt', { type: 'text/plain' });
const result = await lambda.uploadFile(file);
console.log(`File uploaded: ${result.url}`);

// Upload with progress tracking
await lambda.uploadFile(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

### Node.js Environment

```typescript
import { Lambda } from '@genify/lambda-sdk';
import path from 'path';

const lambda = new Lambda({
  uploadSingleURI: 'your-upload-endpoint',
  gateway: 'your-gateway-url'
});

// Upload a single file
const filePath = path.join(__dirname, 'example.txt');
const result = await lambda.uploadFile(filePath);
console.log(`File uploaded: ${result.url}`);

// Upload a directory
const dirPath = path.join(__dirname, 'example-dir');
const dirResult = await lambda.uploadDirectory(dirPath, (fileName, progress) => {
  console.log(`Uploading ${fileName}: ${progress}%`);
});
console.log(`Directory uploaded: ${dirResult.url}`);
```

## API Reference

### `Lambda`

Main class for handling file uploads.

#### Constructor Options

```typescript
interface LambdaConfig {
  uploadSingleURI?: string;  // Single file upload endpoint
  uploadBatchURI?: string;   // Batch upload endpoint
  gateway?: string;          // Gateway URL prefix
}
```

#### Methods

##### `uploadFile`
```typescript
// Browser
uploadFile(file: File, progressCallback?: (progress: number) => void): Promise<UploadResponse>

// Node.js
uploadFile(filePath: string, progressCallback?: (progress: number) => void): Promise<UploadResponse>
```

##### `uploadDirectory` (Node.js only)
```typescript
uploadDirectory(
  dirPath: string, 
  progressCallback?: (fileName: string, progress: number) => void
): Promise<UploadResponse>
```

#### Response Types

```typescript
interface UploadResponse {
  hash: string;    // IPFS hash of the uploaded content
  url: string;     // Complete gateway URL
  size: number;    // File size in bytes
  name: string;    // Original file name
  files?: Array<{  // Only for directory uploads
    Name: string;
    Hash: string;
    Size: number;
  }>;
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run specific test suites
npm run test:node     # Node.js implementation tests
npm run test:browser  # Browser implementation tests
npm run test:utils    # Utility function tests

# Build the package
npm run build
```

## License

MIT