/**
 * @file Check to see if a value is an array
 * @name isArray.js
 * @author Nick Krause
 * @license MIT
 */
import { createRule } from '../validation';

export const isArray = createRule({
  condition: (maybeArr) => Array.isArray(maybeArr),
  message: (notArray) =>
    `Value must be an array, but has type ${typeof notArray}`,
});
