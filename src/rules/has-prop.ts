/**
 * @file Checks an object to make sure that it has a certain property.
 * @name hasProp.js
 * @author Nick Krause
 * @license MIT
 */
import { createRule } from '../rule'

export const hasProp = (...properties: string[]) => {
	let prop = ''
	let currentObjectPath = {}

	return createRule({
		condition: (obj) => {
			currentObjectPath = obj

			for (const property of properties) {
				if (currentObjectPath.hasOwnProperty(property)) {
					prop = property
					currentObjectPath = currentObjectPath[property]
				} else {
					return false
				}
			}

			return true
		},
		message: (obj) => {
			// list out the keys that we have
			// to help us spot where things may have gone wrong prior
			const keys = Object.keys(obj).toString().replace(',', ',\n')

			return `Object containing properties ${keys} does not include ${prop}${
				properties.length > 1 ? ` at path ${properties.join('.')}` : ''
			}`
		},
	})
}
