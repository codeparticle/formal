/**
 * @file Util functions for validators
 * @name utils.js
 * @author Nick Krause
 * @license MIT
 */

class ValidationError extends Error { }

/**
 * id function - returns whatever its input is.
 * @param {Any} x - Any param supplied to this function.
 * @returns {Any} The param supplied to this function.
 */
const id = (x: any) => x

const pipeValidators: (fns: ValidationRuleset) => ValidationRule = (fns) => (
  value: any
) => {
  const [first, ...rest] = fns

  // starting with the first function that returns a monad,
  // we chain through the rest of the functions
  // in order to combine them all into a single check.
  return rest.reduce((prevM, nextM) => prevM.chain(nextM), first(value))
}

/**
 * returnConstant is a convenience method that can be used as an argument to functions that require a function,
 * but ultimately do nothing but return a primitive value.
 * @param {Any} x - Primitive value to be returned.
 */
function returnConstant<T>(x: T): () => T {
  return () => x
}

/**
 * a customized error message to catch incorrect types in Validator.using
 * @param {Function} fn - The incorrect function supplied to using().
 * @returns {String} - A tailored error message that attempts to pinpoint the error.
 */
const validationErrorMessage = (fn: (v: any) => any): string => {
  return `
Chaining validation only works if every function has a .chain() method that takes a Success or Fail object.
Check the type of ${fn.constructor.name} - was it written using createRule?.
`
}

/**
 * Function that checks whether the supplied validator is, itself, valid.
 * @param {Function} validator - Parameter description.
 * @throws {Exception Type} Exception description.
 */
const checkIsValidationM = (validator: Success | Fail): void => {
  if (
    !(
      validator.hasOwnProperty('value') && validator.hasOwnProperty('isSuccess')
    )
  ) {
    throw new ValidationError(validationErrorMessage(validator as any))
  }
}

export {
  id,
  checkIsValidationM,
  pipeValidators,
  returnConstant,
  ValidationError,
}
