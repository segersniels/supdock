import chalk from 'chalk'

export const log = console.log

export const logAndForget = (msg: string) => {
  log(msg)
  process.exit(0)
}

export const info = (msg: string, highlighted: boolean | string[] = []) => {
  let message = msg

  if (typeof highlighted === 'boolean') {
    message = chalk.underline.blue(message)
  } else {
    for (const word of msg.replace(/[^\w\s]/gi, '').split(' ')) {
      if (highlighted.includes(word)) {
        message = message.replace(word, chalk.blue(word))
      }
    }
  }

  log(message)
}

export const warn = (msg: string) => {
  log(chalk.yellow(msg))
}

export const error = (msg: string) => {
  log(chalk.red(msg))

  // Don't exit when testing
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1)
  }
}
