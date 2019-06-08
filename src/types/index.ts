export interface Validator {
  rules: ValidationRuleset;
  result: ValidationM | null;
  of(rules: ValidationRuleset): Validator;
  validate(value: any): Validator;
  then(opts: ValidationActions): any;
}

export interface ValidationRule {
  message: string | ((v?: any) => string);
  opts: CustomValidatorOptions;
  check(v: any): ValidationM;
}

export interface ValidationActions {
  onSuccess: (v: any) => any;
  onFail: (v: string[]) => any;
}

export interface CustomValidatorOptions {
  condition: (v: any) => boolean;
  message: string | ((v: any) => string);
  // function to ensure delayed execution
  // so that we don't get any accidental
  // access errors in the middle of
  // a long list of checks.
  // value works the same way as condition,
  // using the value being checked as an argument.
  transform?: (v: any) => any;
}

export type ValidationM = Success | Fail;

export interface Fail {
  value: any;
  isSuccess: boolean;
  map(fn: (value: any) => any): Fail;
  chain(fn: (value: any) => ValidationM): Fail;
  fold(opts: ValidationActions): any;
}

export interface Success {
  value: any;
  isSuccess: boolean;
  map(fn: (value: any) => any): Success;
  chain(fn: (value: any) => ValidationM): ValidationM;
  fold(opts: ValidationActions): any;
}

export type ValidationCheck = (v: any) => ValidationM;
export type ValidationRuleset = ValidationRule[];
export type ValidationErrorMessage = (fn: (v: any) => any) => string;
