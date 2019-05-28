/**
 * @file class to describe validation failures.
 * @name Failure.js
 * @author Nick Krause
 * @license MIT
 */

import { checkIsValidationM } from './utils';

class Fail implements Fail {
  static of(value: any) {
    return new Fail(value);
  }

  value: any = null;
  isSuccess: boolean = false;

  /**
   * This constructor allows us to coalesce errors from multiple failed checks into
   * one, used when we fold out of this context.
   *
   */
  constructor(value: any) {
    this.value = [].concat(value);
  }

  /**
   * The map function for Fail ignores all effects and returns this as-is.
   * It is a brick wall against doing any unnecessary work if we already know we don't have what we want.
   */
  map(_: (v: any) => any) {
    return this;
  }

  /**
   * The .chain() for Fail takes another Success or Fail, then combines the results.
   */
  chain(validationM: (v: any) => ValidationM): ValidationM {
    try {
      const result = validationM(this.value);
      checkIsValidationM(result);
      // if we're looking at a Success, brick wall it
      if (result.isSuccess) {
        return this;
      }

      // destructuring a set in case two checks return the same error.
      return new Fail([...new Set(this.value.concat(result.value))]);
    } catch (e) {
      // tslint:disable-next-line
      console.error(e.message);
      // tslint:disable-next-line
      console.error(e.stack);
    }
  }

  /**
   * After checks are done, this method is used to extract the value
   * with a function that operates on it.
   */
  fold({ onFail }: ValidationActions) {
    return onFail(this.value);
  }
}

export { Fail };
