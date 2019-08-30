/* eslint-disable */
interface Command {
  description: string;
  question?: string;
  error?: string;
  flags?: string[][];
  type?: string;
  extraUsageInfo?: string;
}

export default Command;
