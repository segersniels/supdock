import Debug from 'debug';
const debug = Debug('%o');

export const traceFunction = () => {
  return function<TFunction extends Function>(target: TFunction) {
    for (const prop of Object.getOwnPropertyNames(target.prototype)) {
      const oldFunc: Function = target.prototype[prop];
      target.prototype[prop] = function(...args: any[]) {
        debug('=> %s %s (%o)', target.name, prop, args);
        return oldFunc.apply(this, args);
      };
    }
  };
};
