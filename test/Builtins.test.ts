/**
 * @file Tests for built-in validations.
 */

import {
	getProp,
	greaterThan,
	hasProp,
	isArray,
	isEqualTo,
	isNonEmptyArray,
	isNonEmptyObject,
	isNonEmptyString,
	isNumber,
	isObject,
	isString,
	isValidEmail,
	lessThan,
	matchesRegex,
	maxLength,
	minLength,
} from '../src'
import { pipeValidators } from '../src/internal/utils'

describe('@codeparticle/formal built-in validations', () => {
	const testStrings = [
		'',
		'0',
		'1',
		'str',
		'100',
		'@@%/&&',
		`Templated with a fancy ${2}`,
		`"escaped"`,
	]
	const testNumbers = [
		NaN,
		0,
		1,
		1492,
		1776,
		Infinity,
		// float
		0.112_358,
		// scientific
		1.3e9,
		// binary
		0b001,
		// octal
		0o012,
		// hex
		0xff_ff_ff_ff,
	]

	const emptyArray = []
	const emptyObject = {}

	const [goodEmail, badEmail] = ['here.therebee.dragons@wowmail.org', 'who@what@why.com']

	const regexes = {
		testCase: /\d/g,
		good: '0123459678',
		bad: 'what did I do?',
	}

	const testObject = {
		deeply: {
			nested: {
				value: 'value',
			},
		},
	}
	const testArray = [...testStrings, ...testNumbers, emptyArray, emptyObject]

	describe('getProp', () => {
		it('drills down into nested objects', () => {
			const testCase = pipeValidators([getProp('deeply'), getProp('nested'), getProp('value')])(
				testObject,
			)

			expect(testCase.isSuccess).toBe(true)
			expect(testCase.value).toBe('value')
		})
		it('fails with bad values', () => {
			const testCase = pipeValidators([
				getProp('strangely'),
				getProp('nested'),
				getProp('corndogs'),
			])(testObject)

			expect(testCase.isSuccess).toBe(false)
		})
	})

	describe('greaterThan', () => {
		const validation = greaterThan(5)

		it('passes with good values', () => {
			expect(validation.check(10).isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(validation.check(5).isSuccess).toBe(false)
		})
	})

	describe('hasProp', () => {
		const validation = hasProp('deeply', 'nested', 'value')

		it('passes with good values', () => {
			expect(validation.check(testObject).isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(validation.check(emptyObject).isSuccess).toBe(false)
		})
		it('does not mutate the object', () => {
			expect(testObject.deeply).toBeDefined()
		})
	})

	describe('isArray', () => {
		it('passes with good values', () => {
			expect(isArray.check(testArray).isSuccess).toBe(true)
			expect(isArray.check(emptyArray).isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(isArray.check(10).isSuccess).toBe(false)
		})
	})

	describe('isNonEmptyArray', () => {
		it('passes with good values', () => {
			expect(isNonEmptyArray.check(testArray).isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(isNonEmptyArray.check(emptyArray).isSuccess).toBe(false)
		})
	})

	describe('isNonEmptyObject', () => {
		it('passes with good values', () => {
			expect(isNonEmptyObject.check(testObject).isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(isNonEmptyObject.check(emptyObject).isSuccess).toBe(false)
		})
	})

	describe('isNonEmptyString', () => {
		it('passes with good values', () => {
			expect(isNonEmptyString.check('wow').isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(isNonEmptyString.check('').isSuccess).toBe(false)
		})
	})

	describe('isNumber', () => {
		const [nan, ...others] = testNumbers

		it('passes with good values', () => {
			for (const num of others) {
				expect(isNumber.check(num).isSuccess).toBe(true)
			}
		})
		it('fails with bad values', () => {
			expect(isNumber.check(nan).isSuccess).toBe(false)

			for (const str of testStrings) {
				expect(isNumber.check(str).isSuccess).toBe(false)
			}
		})
	})

	describe('isObject', () => {
		it('passes with good values', () => {
			expect(isObject.check(emptyObject).isSuccess).toBe(true)
			expect(isObject.check(testObject).isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(isObject.check([]).isSuccess).toBe(false)
		})
	})

	describe('isString', () => {
		it('passes with good values', () => {
			for (const str of testStrings) {
				expect(isString.check(str).isSuccess).toBe(true)
			}
		})
		it('fails with bad values', () => {
			for (const num of testNumbers) {
				expect(isString.check(num).isSuccess).toBe(false)
			}

			expect(isString.check(testObject).isSuccess).toBe(false)
			expect(isString.check(testArray).isSuccess).toBe(false)
		})
	})

	describe('isValidEmail', () => {
		it('passes with good values', () => {
			expect(isValidEmail.check(goodEmail).isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(isValidEmail.check(badEmail).isSuccess).toBe(false)
		})
	})

	describe('lessThan', () => {
		it('passes with good values', () => {
			expect(lessThan(10).check(9).isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(lessThan(10).check(11).isSuccess).toBe(false)
		})
	})

	describe('matchesRegex', () => {
		it('passes with good values', () => {
			expect(matchesRegex(regexes.testCase).check(regexes.good).isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(matchesRegex(regexes.testCase).check(regexes.bad).isSuccess).toBe(false)
		})
	})

	describe('maxLength', () => {
		it('passes with good values', () => {
			expect(maxLength(5).check('wow').isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(maxLength(1).check('wow').isSuccess).toBe(false)
		})
	})

	describe('minLength', () => {
		it('passes with good values', () => {
			expect(minLength(5).check('wow cool').isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(minLength(5).check('wow').isSuccess).toBe(false)
		})
	})

	describe('isEqualTo', () => {
		it('passes with good values', () => {
			expect(isEqualTo(5).check(5).isSuccess).toBe(true)
		})
		it('fails with bad values', () => {
			expect(isEqualTo(0).check(5).isSuccess).toBe(false)
		})
	})
})
