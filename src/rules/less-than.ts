/**
 * @file
 * @name lessThan.js
 * @author Nick Krause
 * @license MIT
 */
import { createRule } from '../rule'

/**
 * Rule to validate a number that must be less than some amount.
 * @param {Number} max - Maximum value.
 */
export const lessThan = (max) =>
  createRule({
    condition: (num) => num < max,
    message: (num) => `${num} must be less than ${max}`,
  })
