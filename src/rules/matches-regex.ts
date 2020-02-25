/**
 * @file rule to verify that a given string matches a certain regex
 * @author Nick Krause
 */

import { createRule } from '../rule'

/**
 * Check to see that a value matches a given regex.
 * Will fail for non-string values.
 * @param regex {RegExp} validation regex
 */
export const matchesRegex = (regex: RegExp) =>
  createRule({
    condition: (maybeStr: string) => regex.test(maybeStr),
    message: (val) => `Value ${val} does not match regular expression ${regex}`,
  })
