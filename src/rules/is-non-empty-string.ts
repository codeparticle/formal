/**
 * @file ensures that a value is a non-empty string.
 * @author Nick Krause
 */

import { createRule } from '../rule';

export const isNonEmptyString = createRule({
  condition: (maybeStr) =>
    typeof maybeStr === 'string' && Boolean(maybeStr.length),
  message: (failed) =>
    typeof failed === 'string'
      ? 'String must not be empty'
      : `Value${failed ? ` ${failed}` : ''} is not a string`,
});
