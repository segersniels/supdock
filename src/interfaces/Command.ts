/* eslint-disable */
import CommandAlias from '../enums/CommandAlias';

interface Command {
  description: string;
  question?: string;
  error?: string;
  flags?: string[][];
  type?: CommandAlias;
  extraUsageInfo?: string;
  customPassing?: boolean;
}

export default Command;
