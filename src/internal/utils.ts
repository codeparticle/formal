/**
 * @file Util functions for validators
 * @name utils.js
 * @author Nick Krause
 * @license MIT
 */

import { ValidationCheck, ValidationM, ValidationRuleset } from '../types'

class ValidationError extends Error {}

/**
 * id function - returns whatever its input is.
 * @param {Any} x - Any param supplied to this function.
 * @returns {Any} The param supplied to this function.
 */
const id = <T>(x: T) => x

const pipeValidators =
	<ValueType = any, Values extends Record<string, any> = Record<string, any>>(
		fns: ValidationRuleset<ValueType, Values>,
		values?: Values,
	): ValidationCheck<ValueType, Values> =>
	(value: any) => {
		const [first, ...rest] = fns

		const firstCheck = (typeof first === 'function' ? first(values) : first).check(value)

		// starting with the first function that returns a monad,
		// we chain through the rest of the functions
		// in order to combine them all into a single check.
		return rest.reduce(
			(prevM, nextM) =>
				prevM.chain(typeof nextM === 'function' ? nextM(values)['check'] : nextM.check),
			firstCheck,
		)
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
Check the type of ${fn.constructor.name} - was it written using createRule?
`
}

/**
 * Function that checks whether the supplied validator is, itself, valid.
 * @param {Function} validator - Parameter description.
 * @throws {Exception Type} Exception description.
 */
const checkIsValidationM = (validator: ValidationM<any>) => {
	if (!(validator.hasOwnProperty('value') && validator.hasOwnProperty('isSuccess'))) {
		throw new ValidationError(validationErrorMessage(validator as any))
	}
}

/**
 * Function that takes an object with field names and rules, then applies those rules to the fields
 * of another object with the same field names. Great for validation of entire objects at once, like
 * forms or API responses.
 */

const validateObject =
	<Rules extends Record<string, ValidationRuleset>>(fieldRules: Rules) =>
	<Vals extends Record<keyof Rules, any>>(
		values: Vals,
	): {
		values: Vals
		hasErrors: boolean
		errors: Partial<Record<keyof Rules, string[]>>
	} => {
		const errors = Object.keys(fieldRules).reduce((errs, fieldName) => {
			if (!(fieldName in values)) {
				throw new Error(`Field ${fieldName} is not in the object being validated`)
			}

			const applyFieldChecks: ValidationCheck<any, Vals> = pipeValidators(
				fieldRules[fieldName],
				values,
			)
			const checkResults: ValidationM<any> = applyFieldChecks(values[fieldName], values)

			if (!checkResults.isSuccess) {
				errs[fieldName] = checkResults.errors
			}

			return errs
		}, {})

		return {
			values,
			hasErrors: Object.keys(errors).length > 0,
			errors,
		}
	}

export { checkIsValidationM, id, pipeValidators, returnConstant, validateObject, ValidationError }
