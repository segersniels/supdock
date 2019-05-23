export const NameCommands = {
  ps: "docker ps |awk '{print $NF}' |tail -n +2",
  psa: "docker ps -a |awk '{print $NF}' |tail -n +2",
  images: "docker images |awk '{print $1}' |tail -n +2",
  psaStopped: "docker ps -a |grep 'Exited' |awk '{print $NF}'",
};
