import { checkIsValidationM } from './internal/utils'
import type { ValidationActions, ValidationM } from './types'

class Success<ValueType, OnSuccessReturns = void> implements Success<ValueType, OnSuccessReturns> {
	static of<T>(value: T): Success<T> {
		return new Success(value)
	}

	isSuccess = true
	errors = []
	value: ValueType = null

	constructor(value: ValueType) {
		this.value = value
		this.errors = []
	}

	map<Returns>(fn: (v: ValueType) => Returns): Success<Returns> {
		return new Success(fn(this.value))
	}

	chain(
		validationFn: (v: NonNullable<ValueType>) => ValidationM<ValueType>,
	): ValidationM<ValueType> {
		try {
			const result = validationFn(this.value)

			checkIsValidationM(result)

			return result
		} catch (error) {
			console.error(error.message)
			console.error(error.stack)
		}
	}

	fold({ onSuccess }: ValidationActions<ValueType, OnSuccessReturns, void>) {
		return onSuccess(this.value)
	}
}

export { Success }
