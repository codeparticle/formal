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

### Built-in Validators

Formal has a small set of useful checks built in to validate simple data.

```ts
import {
  // Basic checks that take no arguments when used in Validator.of
  isString,
  isNumber,
  isObject,
  isArray,
  isNonEmptyObject,
  isNonEmptyArray,
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

## Creating your own validators

Formal gives you the ability to create your own rules to supply to `Validator`. There are two ways to do so.

Using `createRule` is a quick way to check things that _don't change the value that comes out_.

`createRule` takes two (required) options - a condition function, and a message. The message can be a string, or it can be a function that returns a string, in case you'd like to tailor your messages.

```ts
import { createRule } from '@codeparticle/formal';
export const containsMatchingString = (match) =>
  createRule({
    condition: (str) => str.includes(match),
    message: (failedStr) => `Value ${failedStr} does not include today's date.`,
  });
```

Formal also allows more customized checks by exposing `Success` and `Fail`. These are useful in cases where you want to do something when you want to change the output, such as drilling down through nested properties while checking that they exist first.

```ts
import { Success, Fail } from '@codeparticle/formal';

export const getProp = (propName) => (obj) => {
  if (typeof obj !== 'object') {
    return Fail.of('Value is not an object.');
  }

  if (obj.hasOwnProperty(propName)) {
    return Success.of(obj[propName]);
  }

  return Fail.of(`Object does not contain property "${propName}"`);
};
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
