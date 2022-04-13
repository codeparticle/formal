/**
 * @file Rule class for use with createRule and withMessage
 * @author Nick Krause
 */
import { Fail } from './fail'
import { Success } from './success'
import {
  CustomValidatorOptions,
  ValidationCheck,
  ValidationRule,
} from './types'

class Rule implements ValidationRule {
  message: string | ((v: any) => string)
  opts: CustomValidatorOptions

  constructor(opts: CustomValidatorOptions) {
    this.opts = opts
  }

  check: ValidationCheck = (value) => {
    if (this.opts.condition(value)) {
      // Rule and createRule accept an optional function (delayed) parameter
      // called transform that allows us to change the value
      // before it is passed onto the next check.
      if (this.opts.transform) {
        return Success.of(this.opts.transform(value))
      }

      return Success.of(value)
    } else {
      return typeof this.opts.message === `function`
        ? Fail.of(value, [this.opts.message(value)].flat())
        : Fail.of(value, [this.opts.message].flat())
    }
  }
}

/**
 * Exposed interface to create a rule
 */
const createRule: (opts: CustomValidatorOptions) => ValidationRule = (opts) => {
  return new Rule(opts)
}

/**
 * Method to overwrite the message of a rule.
 * Useful if you'd like to use a built-in, but want to change the ultimate message
 * that comes out of a failed check.
 * @param message
 */
const withMessage =
  (message: string | ((v?: any) => string)) => (rule: ValidationRule) =>
    new Rule({ ...rule.opts, message })

export { createRule, Rule, withMessage }
