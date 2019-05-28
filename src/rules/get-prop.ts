/**
 * @file Check to see if an object has a property, then return the value of that property.
 * @name getProp.js
 * @author Nick Krause
 * @license MIT
 */

import { Fail } from '../fail';
import { Success } from '../success';
import { hasProp } from './has-prop';

export const getProp = (property) => (obj) =>
  hasProp(property)(obj).fold({
    onSuccess: () => new Success(obj[property]),
    onFail: () => new Fail(`Property '${property}' does not exist`),
  });
