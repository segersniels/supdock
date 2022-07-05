import { error } from './util';
import { CustomError } from 'ts-custom-error';
import Error from 'enums/Error';

export class ExecutionError extends CustomError {
  constructor(message?: string) {
    super(message);
  }
}

export default class ErrorHandler {
  /**
   * Console.error in case of ExecutionError and throw in case of any other error
   * If optional `fn()` function parameter is passed it gets executed instead
   *
   * @param err
   * @param fn
   */
  public async catch(
    err: Error | ExecutionError,
    fn?: (err: ExecutionError) => void,
  ) {
    if (err instanceof ExecutionError) {
      if (fn) {
        return await fn(err);
      }

      error(err.message);
    } else {
      throw err;
    }
  }
}
