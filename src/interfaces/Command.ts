/* eslint-disable */
import CommandAlias from '../enums/Commands';

interface Command {
  description: string;
  question?: string;
  error?: string;
  flags?: string[][];
  type?: CommandAlias;
  extraUsageInfo?: string;
}

export default Command;
