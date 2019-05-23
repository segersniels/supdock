export const logAndForget = (msg: string) => {
  console.log(msg);
  process.exit(0);
};

export const info = (msg: string) => {
  console.log(msg);
};
