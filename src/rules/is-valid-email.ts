/**
 * @file checks to make sure that an email address has a valid format
 * @author Nick Krause
 */

import { createRule } from '../rule'

/**
 * Check to ensure that an email address is in a valid format.
 * Does NOT check that the email is a valid, in-use address.
 */
export const isValidEmail = createRule({
  // credit to https://tylermcginnis.com/validate-email-address-javascript/ for this regex
  condition: (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str),
  message: `Must be a valid email address`,
})
