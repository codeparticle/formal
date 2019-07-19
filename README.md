# @codeparticle/formal

> A simple data and form validation library with a wide range of possibilities.

### 🔧 Installation

```sh
yarn add @codeparticle/formal
```

## Usage

Formal makes it simple to validate arbitrary data with whatever rules you'd like. It also guarantees that when things fail, you know why, and have a plan B in place.

Here's a playful example:

```ts
import { Validator } from '@codeparticle/formal';
import { isString, minLength } from '@codeparticle/lib/rules';

const techPitchValidator = Validator.of(
  isString,
  minLength(32),
  maxLength(256)
);

const validPitch = "It's like your favorite social network, but for dogs";
const invalidPitch = "It's an AI to rule us all";

const validResult = techPitchValidator
  .validate(validPitch)
  .map((str) => str.toUpperCase());
// returns Success("IT'S LIKE YOUR FAVORITE SOCIAL NETWORK, BUT FOR DOGS") - maps can change successfully checked values

const invalidResult = techPitchValidator
  .validate(invalidPitch)
  .map((str) => str.toUpperCase());
// returns Fail('Must be at least 32 characters') - maps have no effect on failures

validResult.then({
  onSuccess: () => alert("We love it kid. Here's 5 million."),
  onFail: (errs) => console.log(errs), // can also simply be console.log
});

invalidResult.then({
  onSuccess: () => alert("We love it kid. Here's 5 million."),
  onFail: (errs) => errs.map(console.log), // 'Must be at least 32 characters'
});
```

### validateObject

For validating forms or large API responses, formal exposes a `validateObject` utility. Here's an example
of a form with a required name and email field.

```ts
import { rules, validateObject } from '@codeparticle/formal';

const { isNonEmptyString, isValidEmail } = rules;

const validateForm = validateObject({
  name: [isNonEmptyString],
  email: [isNonEmptyString, isValidEmail],
});

const formValues = {
  name: 'hello',
  email: '',
};

validateForm(formValues);
```

calling this will return a schema like this:

```ts
 {
    hasErrors: true,
    errors: {
      email: ['Value must not be empty.', 'Must be a valid email']
    },
    values: {
      name: 'hello',
      email: ''
    }
 }
```

formal is flexible to your style, and exposes a `pipeValidators` function for writing validations in a more functional way. It condenses multiple checks into a function that encloses a value into a `Success` or `Fail` container.

Once run, these validation containers are supplied with an `isSuccess` property for use in filters,with the ability to reach for the internally held `value`. While not recommended for control flow, it's useful in cases where you're running validation over a long list of items, as well as in writing test cases.

```ts
import { pipeValidators, rules } from '@codeparticle/formal';
const { isString, minLength } = rules;

// ...
const isLongString = pipeValidators([isString, minLength(50)]);

values
  .filter((val) => isLongString(val).isSuccess)
  .map((container) => container.value)
  .map((str) => console.log(str));

// this technique can make testing a breeze.

// here, we want all of our objects to have a common property; maybe a required prop in a react component.

// while a bit contrived here, this method makes tests over complex, nested objects
// or other data simple to do.

const testObjects = [
  { required: 'present' },
  { required: 'present' },
  { required: 'wrong' },
];

const check = pipeValidators([isObject, getProp('required')]);

for (const test of testObjects) {
  expect(check(test).isSuccess).toBe(true); // passes

  expect(check(test).value).toBe('present'); // fails
}
```

### Built-in Validators

Formal has a small set of useful checks built in to validate simple data.

```ts
import {
  // Basic validations that take no arguments when used in Validator.of //
  isString,
  isNumber,
  isObject,
  isArray,
  isNonEmptyString,
  isNonEmptyObject,
  isNonEmptyArray,
  isValidEmail, // Only validates format, not ownership.

  // Validations that take arguments before being supplied to Validator or pipeValidators() //

  // Check that a value matches a given regex. matchesRegex(/[A-Z]) || matchesRegex(RegExp('[A-Z]'))
  matchesRegex,
  // Check that a string is x-characters long. Takes a value for the minimum. `minLength(10)`
  minLength,
  // Check that a string is no more than x-characters long. Takes a value for the maximum. `maxLength(50)`
  maxLength,
  // Check that a number is less than a certain amount. Takes a value for the minimum. `lessThan(50)`
  lessThan,
  // Check that a number is less than a certain amount. Takes a value for the maximum. `greaterThan(50)`
  greaterThan,
  // check that an object has a certain property. Takes a value for the key. `hasProp('fieldName')`
  hasProp,
  // check that an object has a property, then return a Success object with its value. `getProp('fieldName')`
  getProp
} from '@codeparticle/formal';
...
```

### Customizing built-in or existing checks

Sometimes, the messages included with built-in or existing checks need to be modified after the fact. Formal supports this via the `withMessage` function.

`withMessage` creates a new copy of the rule, so don't worry about accidentally overwriting something important when using it. Like `createRule`, you can supply a string, or a function that returns a string.

```ts
import { withMessage, rules } from '@codeparticle/formal';

const withAdminFormErrorMessage = withMessage(
  `Admins must enter an administrator ID.`
);
const withUserFormErrorMessage = withMessage(
  `Users must enter their first and last name to sign up`
);

const withInternationalizedErrorMessage = withMessage(
  intl.formatMessage('form.error.message')
);

const withNewMessageFn = withMessage(
  (badValue) => `${badValue} is invalid for this field.`
);

const adminFormFieldCheck = withAdminFormErrorMessage(rules.isNonEmptyString);

const userFormFieldCheck = withUserFormErrorMessage(rules.isNonEmptyString);

const internationalizedFieldCheck = withInternationalizedErrorMessage(
  rules.isString
);

const customMessageFunctionFieldCheck = withNewMessageFn(
  rules.isNonEmptyString
);
```

## Creating your own validators

Formal gives you the ability to create your own rules to supply to `Validator`. There are two ways to do so.

Using `createRule` is a quick way to check things that _don't change the value that comes out_.

`createRule` takes two (required) options - a condition function, and a message. The message can be a string, or it can be a function that returns a string, in case you'd like to tailor your messages.

```ts
import { createRule } from '@codeparticle/formal';
export const containsMatchingString = (match) =>
  createRule({
    condition: (str) => str.includes(match),
    message: (failedStr) => `Value ${failedStr} does not include today's date`,
  });
```

createRule also allows more customized checks through an optional parameter called `transform`
that allows for a transformation of the value _before_ it's handed off to the next validation check.

```ts
import { createRule } from '../rule';
import { hasProp } from './has-prop';

// below is the actual source code of the built-in getProp function.
export const getProp = (property) =>
  createRule({
    condition: (obj) => hasProp(property).check(obj).isSuccess,
    message: `Property '${property}' does not exist`,
    // transform the object to the value of the successfully found property
    // before handing off to the next check / function.
    transform: (obj) => obj[property],
  });
```

## Usage with Typescript

This package exports TS type definitions in the `/types` folder.

```ts
import {
  // interfaces for the Success and Fail classes
  Success,
  Fail,
  // used to specify the argument structure to `createValidator`
  CustomValidationOptions,
  // options supplied to Validator.then
  ValidationActions,
  // alias for `Success | Fail` in cases where both are needed.
  ValidationM,
  // aliases for a single or array of validation rules provided to Validator.of
  ValidationRule,
  // alias for a function that returns a Success or Failure.
  ValidationCheck,
  ValidationRuleSet,
  // interface for the Validator class
  Validator,
} from '@codeparticle/formal/types';
```

[![Build Status](https://travis-ci.org/codeparticle/codeparticle-formal.svg?branch=master)](https://travis-ci.org/codeparticle/codeparticle-formal)
[![NPM version](https://img.shields.io/npm/v/@codeparticle/codeparticle-formal.svg)](https://www.npmjs.com/package/@codeparticle/codeparticle-formal)
![Downloads](https://img.shields.io/npm/dm/@codeparticle/codeparticle-formal.svg)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

---

### 🥂 License

[MIT](./LICENSE.md) as always
