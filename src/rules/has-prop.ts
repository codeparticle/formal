/**
 * @file Checks an object to make sure that it has a certain property.
 * @name hasProp.js
 * @author Nick Krause
 * @license MIT
 */
import { createRule } from '../rule';

export const hasProp = (property) =>
  createRule({
    condition: (obj) => obj.hasOwnProperty(property),
    message: (obj) => {
      // list out the keys that we have
      // to help us spot where things may have gone wrong prior
      const keys = Object.keys(obj)
        .toString()
        .replace(',', ', ');

      return `Object containing properties ${keys} does not include ${property}`;
    },
  });
