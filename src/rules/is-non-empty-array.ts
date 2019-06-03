/**
 * @file Check if an array is actually an array, and also not empty.
 * @author Nick Krause
 * @license MIT
 */
import { Fail } from '../fail';
import { Success } from '../success';
import { isArray } from './is-array';

export const isNonEmptyArray = (maybeArr) =>
  isArray(maybeArr).chain((arr) =>
    arr.length ? Success.of(arr) : Fail.of(arr)
  );
