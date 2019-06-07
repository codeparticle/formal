/**
 * @file Check to ensure that a number is greater than a supplied amount.
 * @name greater-than.js
 * @author Nick Krause
 * @license MIT
 */

import { createRule } from '../rule';

export const greaterThan = (min) =>
  createRule({
    condition: (num) => num > min,
    message: (num) => `${num} must be greater than ${min}`,
  });
