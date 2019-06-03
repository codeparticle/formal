/**
 * @file check that an object has keys
 * @author Nick Krause
 * @license MIT
 */
import { Fail } from '../fail';
import { Success } from '../success';
import { isObject } from './is-object';

export const isNonEmptyObject = (maybeObj: any) =>
  isObject(maybeObj).chain((obj) =>
    Object.keys(obj).length
      ? Success.of(obj)
      : Fail.of(`Object has no properties.`)
  );
