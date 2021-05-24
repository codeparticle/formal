import { checkIsValidationM } from './internal/utils'
import { ValidationActions, ValidationM } from './types'

class Success implements Success {
  static of(value: any): Success {
    return new Success(value)
  }

  isSuccess = true
  errors = []
  value: any = null

  constructor(value: any) {
    this.value = value
    this.errors = []
  }

  map(fn: (v: any) => any) {
    return new Success(fn(this.value))
  }

  chain(validationFn: (v: any) => ValidationM): ValidationM {
    try {
      const result = validationFn(this.value)

      checkIsValidationM(result)

      return result
    } catch (e) {
      // tslint:disable-next-line
      console.error(e.message)
      // tslint:disable-next-line
      console.error(e.stack)
    }
  }

  fold({ onSuccess }: ValidationActions) {
    return onSuccess(this.value)
  }
}

export { Success }
