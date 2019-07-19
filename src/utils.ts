/**
 * @file Util functions for validators
 * @name utils.js
 * @author Nick Krause
 * @license MIT
 */
import { ValidationCheck, ValidationM, ValidationRuleset } from './types';

class ValidationError extends Error {}

/**
 * id function - returns whatever its input is.
 * @param {Any} x - Any param supplied to this function.
 * @returns {Any} The param supplied to this function.
 */
const id = (x: any) => x;

const pipeValidators: (fns: ValidationRuleset) => ValidationCheck = (fns) => (
  value: any
) => {
  const [first, ...rest] = fns;

  // starting with the first function that returns a monad,
  // we chain through the rest of the functions
  // in order to combine them all into a single check.
  return rest.reduce(
    (prevM, nextM) => prevM.chain(nextM.check),
    first.check(value)
  );
};

/**
 * returnConstant is a convenience method that can be used as an argument to functions that require a function,
 * but ultimately do nothing but return a primitive value.
 * @param {Any} x - Primitive value to be returned.
 */
function returnConstant<T>(x: T): () => T {
  return () => x;
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
`;
};

/**
 * Function that checks whether the supplied validator is, itself, valid.
 * @param {Function} validator - Parameter description.
 * @throws {Exception Type} Exception description.
 */
const checkIsValidationM = (validator: ValidationM): void => {
  if (
    !(
      validator.hasOwnProperty('value') && validator.hasOwnProperty('isSuccess')
    )
  ) {
    throw new ValidationError(validationErrorMessage(validator as any));
  }
};

/**
 * Function that takes an object with field names and rules, then applies those rules to the fields
 * of another object with the same field names. Great for validation of entire objects at once, like
 * forms or API responses.
 */

const validateObject = (fieldRules: Record<string, ValidationRuleset>) => (
  values: object
) => {
  const errors = Object.keys(fieldRules).reduce((errs, fieldName) => {
    try {
      if (!(fieldName in values)) {
        throw new Error(
          `Field ${fieldName} is not in the object being validated.`
        );
      }
      const applyFieldChecks: ValidationCheck = pipeValidators(
        fieldRules[fieldName]
      );
      const checkResults: ValidationM = applyFieldChecks(values[fieldName]);

      if (!checkResults.isSuccess) {
        errors[fieldName] = checkResults.value;
      }
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(e.message);
      // tslint:disable-next-line no-console
      console.trace(e);
    }

    return errs;
  }, {});

  return {
    values,
    errors,
  };
};

export {
  id,
  checkIsValidationM,
  pipeValidators,
  returnConstant,
  ValidationError,
  validateObject,
};
