import Debug from 'debug';
import chalk from 'chalk';

export const log = console.log;

export const logAndForget = (msg: string) => {
  log(msg);
  process.exit(0);
};

export const info = (msg: string, highlighted: boolean | string[] = []) => {
  let message = msg;

  if (typeof highlighted === 'boolean') {
    message = chalk.underline.blue(message);
  } else {
    for (const word of msg.replace(/[^\w\s]/gi, '').split(' ')) {
      if (highlighted.includes(word)) {
        message = message.replace(word, chalk.blue(word));
      }
    }
  }

  log(message);
};

export const warn = (msg: string) => {
  log(chalk.yellow(msg));
};

export const error = (msg: string) => {
  log(chalk.red(msg));

  // Don't exit when testing
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
};

// Allows debug tracing of a function to locate where things go wrong
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

export const exit = () => {
  process.exit(0);
};
