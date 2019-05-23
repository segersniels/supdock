export const IdCommands = {
  ps: "docker ps |awk '{print $1}' |tail -n +2",
  psa: "docker ps -a |awk '{print $1}' |tail -n +2",
  images: "docker images |awk '{print $3}' |tail -n +2",
  psaStopped: "docker ps -a |grep 'Exited' |awk '{print $1}'",
};
