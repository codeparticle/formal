import { ValidationError, pipeValidators } from './internal/utils'
import { ValidationActions, ValidationM, ValidationRuleset } from './types'

/**
 * convenience method to generate a Success or Fail with a custom message (or message function),
 * based on the passing of a supplied condition
 *
 */

class Validator<ValueType, OnSuccessReturns = any, OnFailReturns = any> {
	static of<T>(...rules: ValidationRuleset<T>) {
		return new Validator<T>(...rules)
	}

	rules: ValidationRuleset<ValueType> = []
	result: ValidationM<ValueType, OnSuccessReturns, OnFailReturns> | null = null

	constructor(...rules: ValidationRuleset<ValueType>) {
		this.rules = rules.flat()
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
	validate(value: ValueType): Validator<ValueType, OnSuccessReturns, OnFailReturns> {
		this.result = pipeValidators(this.rules)(value)

		return this
	}

	// eslint-disable-next-line unicorn/no-thenable
	then(opts: ValidationActions<ValueType, OnSuccessReturns, OnFailReturns>) {
		if (this.result) {
			// @ts-expect-error Success and Fail have different returns but it's ok here since we only use 1 of them
			// every time
			return this.result.fold(opts)
		} else {
			throw new ValidationError(
				'Validator failed to run - did you supply rules and use validate() first?',
			)
		}
	}
}

export { Validator }
