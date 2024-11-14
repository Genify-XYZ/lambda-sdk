export * from './core/types';
export * from './core/constants';

// Export browser utils
export * as fileUtils from './browser/utils/file';

// Export appropriate Lambda implementation
let LambdaImpl;

if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  // Node.js environment
  LambdaImpl = require('./node/Lambda').Lambda;
} else {
  // Browser environment
  LambdaImpl = require('./browser/Lambda').Lambda;
}

export const Lambda = LambdaImpl;