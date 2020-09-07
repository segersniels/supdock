import sinon from 'sinon';
import * as ArgsHelper from 'helpers/args';

export const parseOutput = (args: string[]) => {
  return `docker ${args.join(' ').replace(/  /g, ' ')}`;
};

export function mock<T extends Record<string, any>>(
  classToMock: T,
  sandbox: sinon.SinonSandbox,
  functionOverrides?: Partial<Record<keyof T, any>> & {
    args?: { command?: string; flags?: any; nonFlags?: string[] };
  },
) {
  // Restore so we can mock multiple times for same command in one test
  sandbox.restore();

  // Stub process.argv (needed because process.argv contains all the arguments passed to mocha command)
  sandbox.stub(ArgsHelper, 'parseArguments').returns({
    command: functionOverrides?.args?.command ?? '',
    flags: functionOverrides?.args?.flags ?? {},
    nonFlags: functionOverrides?.args?.nonFlags ?? [],
  });

  // Mock all the remaining overrides
  delete functionOverrides?.args;

  if (functionOverrides) {
    Object.keys(functionOverrides).forEach(f => {
      sandbox.stub(classToMock, f).returns(functionOverrides[f]);
    });
  }
}
