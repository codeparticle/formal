/**
 * @file Check if an array is actually an array, and also not empty.
 * @author Nick Krause
 * @license MIT
 */
import { createRule } from '../rule'

export const isNonEmptyArray = createRule({
  condition: (arr) => Array.isArray(arr) && arr.length > 0,
  message: (val) =>
    Array.isArray(val)
      ? `Array must not be empty`
      : `No array values found in ${val}`,
})
