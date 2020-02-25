/**
 * @file Check to ensure that the supplied value is an object.
 * @name isObject.js
 * @author Nick Krause
 * @license MIT
 */
import { createRule } from '../rule'

export const isObject = createRule({
  condition: (obj) =>
    typeof obj === `object` && !Array.isArray(obj) && Boolean(obj),
  message: (notObj) => `Value must be an object, but has type ${typeof notObj}`,
})
