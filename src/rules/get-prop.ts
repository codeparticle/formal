/**
 * @file Check to see if an object has a property, then return the value of that property.
 * @name getProp.js
 * @author Nick Krause
 * @license MIT
 */

import { createRule } from '../rule'

export const getProp = (...properties: string[]) => {
  let prop = ``
  let currentObjectPath = {}

  return createRule({
    condition: (obj) => {
      currentObjectPath = obj

      for (const property of properties) {
        if (currentObjectPath.hasOwnProperty(property)) {
          prop += `.${property}`
          currentObjectPath = currentObjectPath[property]
        } else {
          return false
        }
      }

      return true
    },
    message: () => {
      const path = properties.join(`.`)

      return `Object does not include property ${path.slice(
        prop.length - 1,
      )} at path .${path}`
    },

    transform: (obj) => properties.reduce((acc, key) => acc[key], obj),
  })
}
