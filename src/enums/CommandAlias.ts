enum CommandAlias {
  RUNNING_CONTAINERS = 'docker ps --format "{{.ID}} - {{.Names}} ({{.Image}})"',
  ALL_CONTAINERS = 'docker ps --format "{{.ID}} - {{.Names}} ({{.Image}})" --all',
  STOPPED_CONTAINERS = 'docker ps --format "{{.ID}} - {{.Names}} ({{.Image}})" --all --filter status=exited',
  IMAGES = 'docker images --format "{{.ID}} - {{.Repository}}"',
}

export default CommandAlias;
