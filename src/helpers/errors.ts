import { error } from './util';

export class ExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExecutionError';

    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
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
  public catch(
    err: Error | ExecutionError,
    fn?: (err: ExecutionError) => void,
  ) {
    if (err instanceof ExecutionError) {
      if (fn) {
        return fn(err);
      }

      error(err.message);
    } else {
      throw err;
    }
  }
}
