export const IdCommands = {
  ps: 'docker ps -q',
  psa: 'docker ps -aq',
  images: 'docker images -q',
  psaStopped: 'docker ps -qf status=exited',
};
