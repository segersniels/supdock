export const parseOutput = (args: string[]) => {
  return `docker ${args.join(' ').replace(/  /g, ' ')}`;
};
