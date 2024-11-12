# Lambda SDK

A TypeScript SDK for file uploads and IPFS integration, supporting both Node.js and browser environments.

## Features

- File and directory uploads to IPFS
- Image processing and preview generation
- Progress tracking
- Type-safe API
- Supports both Node.js and browser environments

## Installation
```bash
npm install lambda-sdk
```

## Usage

### Node.js
```typescript
import { Lambda } from 'lambda-sdk';
const lambda = new Lambda();
// Upload a file
const result = await lambda.uploadFile('path/to/file.txt', (progress) => {
console.log(Upload progress: ${progress}%);
});
// Upload a directory
const dirResult = await lambda.uploadDirectory('path/to/dir');
```


### Browser

```typescript
import { Lambda } from 'lambda-sdk';
const lambda = new Lambda();
// Upload a file
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const result = await lambda.uploadFile(file, (progress) => {
console.log(Upload progress: ${progress}%);
});
// Upload an image with processing
const imageResult = await lambda.uploadImage(file, {
maxWidth: 800,
maxHeight: 600,
quality: 0.8
});
```

## Development

``` bash
Install dependencies
npm install
Run tests
npm test
Build
npm run build
```

## License

MIT



