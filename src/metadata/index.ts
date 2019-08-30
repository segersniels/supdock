import CommandsEnum from '../enums/Commands';
import Command from '../interfaces/Command';

const commands: { [name: string]: Command } = {
  logs: {
    description: 'See the logs of a container',
    question: 'Which container would you like to see the logs of?',
    error: 'no containers to see the logs of',
    flags: [['f', 'follow'], ['t', 'timestamps'], ['details']],
    type: CommandsEnum.ALL_CONTAINERS,
  },
  restart: {
    description: 'Restart a running container',
    question: 'Which container would you like to restart?',
    error: 'no containers available to restart',
    flags: [['t', 'time']],
    type: CommandsEnum.RUNNING_CONTAINERS,
    extraUsageInfo:
      'It is possible to pass "all" as the name/id to restart all currently running containers.\n  eg. supdock restart all',
  },
  start: {
    description: 'Start a stopped container',
    question: 'Which container would you like to start?',
    error: 'no containers available to start',
    flags: [['a', 'attach'], ['i', 'interactive']],
    type: CommandsEnum.STOPPED_CONTAINERS,
    extraUsageInfo:
      'It is possible to pass "all" as the name/id to start all currently stopped containers.\n  eg. supdock start all',
  },
  stop: {
    description: 'Stop a running container',
    question: 'Which container would you like to stop?',
    error: 'no containers available to stop',
    flags: [['f', 'force'], ['t', 'time']],
    type: CommandsEnum.RUNNING_CONTAINERS,
    extraUsageInfo:
      'It is possible to pass "all" as the name/id to stop all currently running containers.\n  eg. `supdock stop all`',
  },
  ssh: {
    description: 'SSH into a container',
    question: 'Which container would you like to SSH to?',
    error: 'no containers available',
    type: CommandsEnum.RUNNING_CONTAINERS,
  },
  env: {
    description: 'See the environment variables of a running container',
    question:
      'Which container would you like to see the environment variables of?',
    error: 'no containers running',
    type: CommandsEnum.RUNNING_CONTAINERS,
  },
  rm: {
    description: 'Remove a container',
    question: 'Which container would you like to remove?',
    error: 'no containers to remove',
    flags: [['f', 'force'], ['l', 'link'], ['v', 'volumes']],
    type: CommandsEnum.STOPPED_CONTAINERS,
  },
  rmi: {
    description: 'Remove an image',
    question: 'Which image would you like to remove?',
    error: 'no images to remove',
    flags: [['f', 'force'], ['no-prune']],
    type: CommandsEnum.IMAGES,
  },
  history: {
    description: 'See the history of an image',
    question: 'Which image would you like to see the history of?',
    error: 'no images available',
    flags: [['H', 'human'], ['q', 'quiet'], ['no-trunc']],
    type: CommandsEnum.ALL_CONTAINERS,
  },
  stats: {
    description: 'See the stats of a container',
    question: 'Which containers would you like to see that stats of?',
    error: 'no containers available',
    flags: [['p', 'prompt'], ['no-stream'], ['no-trunc']],
    type: CommandsEnum.RUNNING_CONTAINERS,
  },
  inspect: {
    description: 'Inspect a container',
    question: 'Which image would you like to inspect?',
    error: 'no containers to inspect',
    flags: [['s', 'size']],
    type: CommandsEnum.ALL_CONTAINERS,
  },
  prune: {
    description:
      'Remove stopped containers and dangling images. For more detailed usage refer to "docker system prune -h"',
  },
};

export default commands;
