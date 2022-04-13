/**
 * @file ensures that a value is a non-empty string.
 * @author Nick Krause
 */

import { createRule } from '../rule'

export const isNonEmptyString = createRule({
  condition: (maybeStr) =>
    typeof maybeStr === `string` && maybeStr.length > 0,
  message: `Value must be a non-empty string`,
})
