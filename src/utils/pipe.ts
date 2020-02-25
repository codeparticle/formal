/**
 * Pipe a set of functions over an argument, starting at the leftmost argument
 *
 * @author Nick Krause
 * @license MIT
 */

const pipe = <T=any>(...fns: Array<(v: T) => any>) => (x: T) => fns.reduce((v, f) => f(v), x)

export {
  pipe,
}