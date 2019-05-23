import CommandAliasses from './default';

export const NameCommands = {
  ps: CommandAliasses.RUNNING_CONTAINER_NAMES,
  psa: CommandAliasses.ALL_CONTAINER_NAMES,
  images: CommandAliasses.IMAGE_NAMES,
  psaStopped: CommandAliasses.ALL_STOPPED_CONTAINER_NAMES,
};
