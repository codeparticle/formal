/**
 * @file ensures that a value is a non-empty string.
 * @author Nick Krause
 */

import { createRule } from '../rule'

export const isNonEmptyString = createRule({
  condition: (maybeStr) => typeof maybeStr === `string` && Boolean(maybeStr.length),
  message: `Value must be a non-empty string`,
})
