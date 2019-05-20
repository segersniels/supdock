import CommandAliasses from './default';

export const IdCommands = {
  ps: CommandAliasses.RUNNING_CONTAINER_IDS,
  psa: CommandAliasses.ALL_CONTAINER_IDS,
  images: CommandAliasses.IMAGE_IDS,
  psaStopped: CommandAliasses.ALL_STOPPED_CONTAINER_IDS,
};
