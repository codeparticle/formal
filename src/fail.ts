/**
 * @file class to describe validation failures.
 * @name Failure.js
 * @author Nick Krause
 * @license MIT
 */
import { checkIsValidationM } from './internal/utils'
import { ValidationActions, ValidationM } from './types'

class Fail implements Fail {
  static of(value: any, errors: string[] = []) {
    return new Fail(value, errors)
  }

  value: any = null
  errors: string[] = []
  isSuccess = false

  /**
   * This constructor allows us to coalesce errors from multiple failed checks into
   * one, used when we fold out of this context.
   *
   */
  constructor(value: any, errors: string[] = []) {
    this.value = value
    this.errors = errors
  }

  /**
   * The map function for Fail ignores all effects and returns this as-is.
   * It is a brick wall against doing any unnecessary work if we already know we don't have what we want.
   */
  map(fn) {
    return new Fail(fn(this.value), this.errors)
  }

  /**
   * The .chain() for Fail takes another Success or Fail, then combines the results.
   */
  chain(validationM: (v: any, e?: string[]) => ValidationM): ValidationM {
    try {
      const result = validationM(this.value, this.errors)

      checkIsValidationM(result)

      // destructuring a set in case two checks return the same error.
      return new Fail(
        result.value,
        this.errors.concat(result?.errors ?? []),
      )
    } catch (e) {
      // tslint:disable-next-line
      console.error(e.message)
      // tslint:disable-next-line
      console.error(e.stack)
    }
  }

  /**
   * After checks are done, this method is used to extract the value
   * with a function that operates on it.
   */
  fold({ onFail }: ValidationActions) {
    return onFail(this.errors)
  }
}

export { Fail }
