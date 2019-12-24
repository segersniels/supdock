import CommandAlias from '../enums/CommandAlias';

interface Command {
  description: string;
  question?: string;
  error?: string;
  flags?: string[][];
  type?: CommandAlias;
  extraUsageInfo?: string;
  usage?: string;
  custom?: boolean;
  options?: any;
  allowFuzzySearching?: boolean;
  parallelExecution?: boolean;
}

export default Command;
