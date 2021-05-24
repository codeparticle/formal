/**
 * @file Unit tests for @codeparticle/formal
 */
import { id, validateObject } from '../src/internal/utils'
import { createRule, withMessage } from '../src/rule'
import {
  getProp,
  isNonEmptyString,
  isNumber,
  isObject,
  isString,
  isValidEmail,
  isEqualTo,
} from '../src/rules'

import { Validator } from '../src/validation'

describe(`Validation`, () => {
  const testObject = {
    nested: {
      property: {
        num: 2,
      },
    },
  }

  const testOpts = {
    onSuccess: id,
    onFail: id,
  }

  it(`Takes a list of validators made with createValidator and checks a value accordingly`, () => {
    const testValue = Validator.of(
      isObject,
      getProp(`nested`, `property`),
      getProp(`num`),
      isNumber,
    ).validate(testObject)

    const folded = testValue.then({
      onSuccess: id,
      onFail: id,
    })

    expect(testValue.result.isSuccess).toEqual(true)
    expect(folded).toEqual(2)
  })

  it(`Collects errors when multiple conditions fail`, () => {
    const failedObject = Validator.of(
      isObject,
      getProp(`nested`, `property`, `fail`),
    ).validate(testObject)

    const failedString = Validator.of(isString).validate(2)
    const failedNumber = Validator.of(isNumber).validate(`wow`)

    expect(failedObject.result.isSuccess).toEqual(false)
    expect(failedString.result.isSuccess).toEqual(false)
    expect(failedNumber.result.isSuccess).toEqual(false)

    expect(failedObject.then(testOpts)).toMatchObject([
      `Object does not include property .fail at path .nested.property.fail`,
    ])

    expect(failedString.then(testOpts)).toMatchObject([
      `Value is not a string`,
    ])
    expect(failedNumber.then(testOpts)).toMatchObject([
      `Value wow is not a number`,
    ])
  })
})

describe(`Rule`, () => {
  const customRule = createRule({
    condition: (val) => val > 3,
    message: `value must be greater than 3`,
  })

  it(`allows for initialization through createRule`, () => {
    expect(customRule.check(3).isSuccess).toBe(false)
    expect(customRule.check(5).isSuccess).toBe(true)
    expect(customRule.check(3).errors[0]).toBe(`value must be greater than 3`)
  })

  it(`allows for overwriting the message of an existing rule using withMessage`, () => {
    const overwriteText = withMessage(`Whoa`)
    const newRule = overwriteText(customRule)
    const overwriteFn = withMessage((d) => `Man, that's a crooked ${d}`)

    expect(newRule.check(2).isSuccess).toBe(false)
    expect(overwriteFn(newRule).check(2).errors[0]).toBe(
      `Man, that's a crooked 2`,
    )
    expect(newRule.check(2).errors[0]).toBe(`Whoa`)
  })
})

describe(`validateObject`, () => {
  it(`can validate over an object, returning the original with an attached error object containing messages`, () => {

    const hasExactlyTwoNameObjects = createRule({
      condition: arr => arr.length === 2,
      message: `Exactly two names must exist`,
    })

    const daveIsSpelledBackwardsSomewhere = createRule({
      condition: arr => Boolean(arr.find(o => o.name === `evad`)),
      message: `Dave is not spelled backwards somewhere`,
    })

    const validate = validateObject({
      // required fields
      firstName: [isNonEmptyString],
      lastName: [isNonEmptyString],
      email: [isNonEmptyString, isValidEmail, values => isEqualTo((values[`confirmationEmail`]))],
      confirmationEmail: [
        values => isEqualTo(values[`email`]),
        isNonEmptyString,
        isValidEmail,
      ],
      // non-required fields
      city: [isString],
      names: [hasExactlyTwoNameObjects, daveIsSpelledBackwardsSomewhere],
    })

    const testFormFields = {
      empty: {},
      bad: {
        firstName: ``,
        lastName: 5,
        email: `notbad@email.com`,
        confirmationEmail: `bad`,
        city: 5,
        names: [
          {
            name: `what?`,
          },
        ],
      },
      good: {
        firstName: `captain`,
        lastName: `wow`,
        email: `savesday@everyday.net`,
        confirmationEmail: `savesday@everyday.net`,
        city: ``,
        names: [{
          name: `dave`,
        }, {
          name: `evad`,
        }],
      },
    }

    const invalid = validate(testFormFields.bad)
    const valid = validate(testFormFields.good)

    expect(invalid.hasErrors).toBe(true)
    expect(valid.hasErrors).toBe(false)

    expect(invalid.errors).toMatchObject({
      firstName: [`Value must be a non-empty string`],
      lastName: [`Value must be a non-empty string`],
      email: [`Values must be equal`],
      confirmationEmail: [`Values must be equal`, `Must be a valid email address`],
      city: [`Value is not a string`],
      names: [`Exactly two names must exist`, `Dave is not spelled backwards somewhere`],
    })
  })
})
