// Remove the Node.js FormData
// global.FormData = require('form-data');

// Instead, ensure we're using the browser's FormData
class FormDataMock {
    private data = new Map();
  
    append(key: string, value: any, filename?: string) {
      this.data.set(key, { value, filename });
    }
  
    get(key: string) {
      return this.data.get(key);
    }
  }
  
  // Only set if we're in a Node.js environment (jsdom doesn't have FormData)
  if (typeof FormData === 'undefined') {
    global.FormData = FormDataMock as any;
  }
  
  // Add any other necessary browser globals
  global.Blob = require('blob-polyfill').Blob;
  global.File = require('blob-polyfill').File;