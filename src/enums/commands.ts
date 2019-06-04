const enum Commands {
  RUNNING_CONTAINERS = 'docker ps --format "{{.ID}} - {{.Names}}"',
  ALL_CONTAINERS = 'docker ps --format "{{.ID}} - {{.Names}}" --all',
  STOPPED_CONTAINERS = 'docker ps --format "{{.ID}} - {{.Names}}" --all --filter status=exited',
  IMAGES = 'docker images --format "{{.ID}} - {{.Repository}}"',
}

export default Commands;
