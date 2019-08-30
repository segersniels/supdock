/* eslint-disable */
import CommandsEnum from '../enums/Commands';

interface Command {
  description: string;
  question?: string;
  error?: string;
  flags?: string[][];
  type?: CommandsEnum;
  extraUsageInfo?: string;
}

export default Command;
