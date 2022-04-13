/**
 * Validator to ensure that this value is equivalent to another that may or may not be available
 * at time of definition.
 */

import { createRule } from '../rule'

const isEqualTo = (value) =>
  createRule({
    condition: (val) =>
      typeof value === `function` ? val === value() : val === value,
    message: () => `Values must be equal`,
  })

export { isEqualTo }
