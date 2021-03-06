/**
 * @file Check to see if a value is typeof string
 * @author Nick Krause
 * @license MIT
 */

import { createRule } from '../rule'

export const isString = createRule({
  condition: (maybeStr) => typeof maybeStr === `string`,
  message: () => `Value is not a string`,
})
