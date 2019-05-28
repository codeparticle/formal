/**
 * @file Check to see if a value is typeof string
 * @author Nick Krause
 * @license MIT
 */

import { createRule } from '../validation';

export const isString = createRule({
  condition: (maybeStr) => typeof maybeStr === 'string',
  message: (notStr) => `Value ${notStr.toString()} is not a string.`,
});
