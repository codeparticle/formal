/**
 * @file Check that something is a valid number
 * @name isNumber.js
 * @author Nick Krause
 * @license MIT
 */

import { createRule } from '../validation';

export const isNumber = createRule({
  condition: (maybeNum) => typeof maybeNum === 'number',
  message: (notNum) => `Value ${notNum} is not a number.`,
});
