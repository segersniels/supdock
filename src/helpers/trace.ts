require('manakin').global /* eslint-disable-line */

const ENABLE_TRACING_FOR_FOLLOWING_FUNCTIONS = ['spawn', 'executeInParallel']

export const traceFunction = () => {
  return function<TFunction extends Function> (target: TFunction) {
    for (const prop of Object.getOwnPropertyNames(target.prototype)) {
      if (!ENABLE_TRACING_FOR_FOLLOWING_FUNCTIONS.includes(prop)) continue
      const oldFunc: Function = target.prototype[prop]
      if (oldFunc instanceof Function) {
        target.prototype[prop] = function () {
          if (process.env.DEBUG) {
            console.trace()
          }
          return oldFunc.apply(this, arguments)
        }
      }
    }
  }
}
