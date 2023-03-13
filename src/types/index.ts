export interface Validator<ValueType, OnSuccessReturns, OnFailReturns> {
	rules: ValidationRuleset<ValueType>
	result: ValidationM<ValueType, OnSuccessReturns, OnFailReturns> | null
	of(rules: ValidationRuleset<ValueType>): Validator<ValueType, OnSuccessReturns, OnFailReturns>
	validate(value: ValueType): Validator<ValueType, OnSuccessReturns, OnFailReturns>
	then(opts: ValidationActions<ValueType, OnSuccessReturns, OnFailReturns>): ValueType
}

export interface ValidationRule<ValueType> {
	message: string | ((v?: ValueType) => string)
	opts: CustomValidatorOptions<ValueType>
	check(v: ValueType): ValidationM<ValueType>
}

export interface ValidationActions<ValueType, OnSuccessReturns, OnFailReturns> {
	onSuccess: (val?: ValueType) => OnSuccessReturns
	onFail: (errs: string[]) => OnFailReturns
}

export interface CustomValidatorOptions<ValueType, TransformReturns = any> {
	condition: (v: ValueType) => boolean
	message: string | ((v?: ValueType) => string)
	// function to ensure delayed execution
	// so that we don't get any accidental
	// access errors in the middle of
	// a long list of checks.
	// value works the same way as condition,
	// using the value being checked as an argument.
	transform?: (v?: ValueType) => TransformReturns
}

export type ValidationM<ValueType, OnSuccessReturns = any, OnFailReturns = any> =
	| Success<ValueType, OnSuccessReturns>
	| Fail<ValueType, OnFailReturns>

export interface Fail<ValueType, OnFailReturns = void> {
	value: ValueType
	errors: string[]
	isSuccess: boolean
	map<Returns = ValueType>(fn: (value: ValueType) => Returns): Fail<Returns>
	chain(
		fn: (value: ValueType, errors?: string[]) => ValidationM<ValueType, never, OnFailReturns>,
	): Fail<ValueType>
	fold(opts: ValidationActions<ValueType, never, OnFailReturns>): OnFailReturns
}

export interface Success<ValueType, OnSuccessReturns = void> {
	value: ValueType
	// ghost type - errors will never exist on a Success
	errors: string[]
	isSuccess: boolean
	map<Returns = ValueType>(fn: (value: ValueType) => Returns): Success<ValueType, OnSuccessReturns>
	chain(fn: (value: ValueType) => ValidationM<ValueType>): ValidationM<ValueType>
	fold(opts: ValidationActions<ValueType, OnSuccessReturns, OnSuccessReturns>): ValueType
}

export type ValidationCheck<
	ValueType,
	FormValues extends Record<string, any> = Record<string, any>,
	OnSuccessReturns = any,
	OnFailReturns = any,
> = (
	value: ValueType,
	formValues?: FormValues,
) => ValidationM<ValueType, OnSuccessReturns, OnFailReturns>

export type ValidationRuleset<
	ValueType = any,
	FormValues extends Record<string, any> = Record<string, any>,
> = (ValidationRule<ValueType> | ((v: any) => ValidationRule<ValueType>))[]
export type ValidationErrorMessage = (fn: <T>(v: T) => string) => string
