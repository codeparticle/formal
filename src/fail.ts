/**
 * @file class to describe validation failures.
 * @name Failure.js
 * @author Nick Krause
 * @license MIT
 */
import { checkIsValidationM } from './internal/utils'
import { ValidationActions, ValidationM } from './types'

class Fail<ValueType, OnFailReturns = any> implements Fail<ValueType, OnFailReturns> {
	static of<T>(value: T, errors: string[] = []) {
		return new Fail<T>(value, errors)
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
	 * The map function for Fail preserves the value without mapping anything over it, and accumulates errors on the side.
	 */
	map() {
		return new Fail(this.value, this.errors)
	}

	/**
	 * The .chain() for Fail takes another Success or Fail, then combines the results.
	 */
	chain(
		validationM: (v: any, e?: string[]) => ValidationM<ValueType>,
	): Fail<ValueType, OnFailReturns> {
		try {
			const result = validationM(this.value, this.errors)

			checkIsValidationM(result)

			return new Fail(result.value, [...this.errors, ...(result?.errors ?? [])])
		} catch (error) {
			console.error(error.message)
			console.error(error.stack)
		}
	}

	/**
	 * After checks are done, this method is used to extract the value
	 * with a function that operates on it.
	 */
	fold({ onFail }: ValidationActions<ValueType, never, OnFailReturns>) {
		return onFail(this.errors)
	}
}

export { Fail }
