/**
 * @file Check to see if an object has a property, then return the value of that property.
 * @name getProp.js
 * @author Nick Krause
 * @license MIT
 */

import { createRule } from '../rule';
import { hasProp } from './has-prop';

export const getProp = (property) =>
  createRule({
    condition: (obj) => hasProp(property).check(obj).isSuccess,
    message: `Property '${property}' does not exist`,
    // transform the object to the value of the successfully found property
    // before handing off to the next check / function.
    transform: (obj) => obj[property],
  });
