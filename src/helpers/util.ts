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

  if (process.env.NODE_ENV !== 'test') {
    log(message);
  }
};

export const warn = (msg: string) => {
  log(chalk.yellow(msg));
};

export const error = (msg: string) => {
  log(chalk.red(msg));
  process.exit(1);
};
