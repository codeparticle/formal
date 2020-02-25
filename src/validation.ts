import { pipeValidators, ValidationError } from './internal/utils'
import {
  ValidationActions,
  ValidationM,
  ValidationRuleset,
} from './types'

/**
 * convenience method to generate a Success or Fail with a custom message (or message function),
 * based on the passing of a supplied condition
 *
 */

class Validator implements Validator {
  static of(...rules: ValidationRuleset) {
    return new Validator(...rules)
  }

  rules: ValidationRuleset = []
  result: ValidationM | null = null

  constructor(...rules: ValidationRuleset) {
    this.rules = [].concat(...rules)
  }

  /**
   * Run all of the supplied validators against the value that Validator() was supplied with,
   * then operate on the results based on whether this succeeded or failed.
   * @param {Object} opts
   * @property {Function} onSuccess
   * @property {Function} onFail
   *
   * @returns {Any} result
   */
  validate(value: any): Validator {
    this.result = pipeValidators(this.rules)(value)

    return this
  }

  then(opts: ValidationActions) {
    if (this.result) {
      return this.result.fold(opts)
    } else {
      throw new ValidationError(
        `Validator failed to run - did you supply rules and use validate() first?`,
      )
    }
  }
}

export { Validator }
