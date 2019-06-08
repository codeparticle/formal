/**
 * @file check that an object has keys
 * @author Nick Krause
 * @license MIT
 */
import { createRule } from '../rule';

export const isNonEmptyObject = createRule({
  // Reflect.ownKeys is used because
  // this check should not fail if we only have
  // properties that are non-enumerable
  // like 'Symbol' or properties defined by Object.defineProperty where
  // 'enumerable' is set to false.
  condition: (obj) => typeof obj === 'object' && !!Reflect.ownKeys(obj).length,
  message: (obj) =>
    typeof obj === 'object'
      ? `Object must not be empty`
      : `Value ${obj} is not an object`,
});
