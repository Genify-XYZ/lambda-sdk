export * from './core/types';
export * from './core/constants';

// Export browser utils
export * as imageUtils from './browser/utils/image';
export * as fileUtils from './browser/utils/file';

// Export appropriate Lambda implementation
let LambdaImpl;

if (typeof window === 'undefined') {
  LambdaImpl = require('./node/Lambda').Lambda;
} else {
  LambdaImpl = require('./browser/Lambda').Lambda;
}

export const Lambda = LambdaImpl;