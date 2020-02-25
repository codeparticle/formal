import { createRule } from '../rule'

/**
 * Function to ensure that a string is below or equal to a certain length.
 * @param {Number} maxLength - Max length of the string.
 */
export const maxLength = (max) =>
  createRule({
    condition: (str) => Boolean(str) && str.length <= max,
    message: `Must be shorter than ${max + 1} characters`,
  })
