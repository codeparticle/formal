/**
 * compose a set of functions over an argument
 *
 * @author Nick Krause
 * @license MIT
 */

const compose = <T=any>(...fns: Array<(v: T) => any>) => (x: T) => fns.reduceRight((v, f) => f(v), x)

export {
  compose,
}