const enum CommandAliasses {
  RUNNING_CONTAINER_NAMES = "docker ps |awk '{print $NF}' |tail -n +2",
  RUNNING_CONTAINER_IDS = "docker ps |awk '{print $1}' |tail -n +2",
  ALL_CONTAINER_NAMES = "docker ps -a |awk '{print $NF}' |tail -n +2",
  ALL_CONTAINER_IDS = "docker ps -a |awk '{print $1}' |tail -n +2",
  ALL_STOPPED_CONTAINER_NAMES = "docker ps -a |grep 'Exited' |awk '{print $NF}'",
  ALL_STOPPED_CONTAINER_IDS = "docker ps -a |grep 'Exited' |awk '{print $1}'",
  IMAGE_NAMES = "docker images |awk '{print $1}' |tail -n +2",
  IMAGE_IDS = "docker images |awk '{print $3}' |tail -n +2",
}

export default CommandAliasses;
