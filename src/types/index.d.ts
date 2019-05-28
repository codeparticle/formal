declare interface Validator {
  rules: ValidationRuleset;
  result: ValidationM | null;
  of(rules: ValidationRuleset): Validator;
  validate(value: any): Validator;
  then(opts: ValidationActions): any;
}

declare interface ValidationActions {
  onSuccess: (v: any) => any;
  onFail: (v: string[]) => any;
}

declare interface CustomValidatorOptions {
  condition: (v: any) => boolean;
  message: string | ((v: any) => string);
}

declare type ValidationM = Success | Fail;

declare interface Fail {
  value: any;
  isSuccess: boolean;
  map(fn: (value: any) => any): Fail;
  chain(fn: (value: any) => ValidationM): Fail;
  fold(opts: ValidationActions): any;
}

declare interface Success {
  value: any;
  isSuccess: boolean;
  map(fn: (value: any) => any): Success;
  chain(fn: (value: any) => ValidationM): ValidationM;
  fold(opts: ValidationActions): any;
}

declare type ValidationRule = (v: any) => ValidationM;
declare type ValidationRuleset = ValidationRule[];
declare type ValidationErrorMessage = (fn: (v: any) => any) => string;
