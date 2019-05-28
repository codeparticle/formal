/**
 * @file Checks an object to make sure that it has a certain property.
 * @name hasProp.js
 * @author Nick Krause
 * @license MIT
 */
import { createRule } from '../validation';

export const hasProp = (property) =>
  createRule({
    condition: (obj) => obj.hasOwnProperty(property),
    message: (obj) => {
      const keys = Object.keys(obj)
        .toString()
        .replace(',', ', ');

      return `Object containing properties ${keys} does not include ${property}`;
    },
  });
