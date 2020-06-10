import CommandAlias from 'enums/CommandAlias';
import ConfigOptions from 'enums/ConfigOptions';

export interface Metadata {
  description: string;
  question?: string;
  error?: string;
  flags?: string[][];
  type?: CommandAlias;
  extraUsageInfo?: string;
  usage?: string;
  custom?: boolean;
  options?: any;
  allowFuzzySearching?: boolean;
  parallelExecution?: boolean;
}

export type Commands = Record<string, Metadata>;

const configOptions = {
  [ConfigOptions.CAUTION_CHECK]:
    'When fuzzy searching is enabled we ask the user for confirmation before we execute the command. Default: enabled',
  [ConfigOptions.FUZZY_SEARCH]: 'Disable fuzzy searching. Default: disabled',
  [ConfigOptions.SHORT_LOGS]:
    'Enforce a more readable log by default limiting the length to 500 lines. Default: disabled',
};

const metadata: Commands = {
  logs: {
    description: 'See the logs of a container',
    question: 'Which container would you like to see the logs of?',
    error: 'no containers to see the logs of',
    flags: [['f', 'follow'], ['t', 'timestamps'], ['details']],
    type: CommandAlias.ALL_CONTAINERS,
    allowFuzzySearching: true,
  },
  restart: {
    description: 'Restart a running container',
    question: 'Which container would you like to restart?',
    error: 'no containers available to restart',
    flags: [['t', 'time']],
    type: CommandAlias.RUNNING_CONTAINERS,
    extraUsageInfo:
      'It is possible to pass "all" as the name/id to restart all currently running containers.\n  eg. supdock restart all',
    allowFuzzySearching: true,
    parallelExecution: true,
  },
  start: {
    description: 'Start a stopped container',
    question: 'Which container would you like to start?',
    error: 'no containers available to start',
    flags: [
      ['a', 'attach'],
      ['i', 'interactive'],
    ],
    type: CommandAlias.STOPPED_CONTAINERS,
    extraUsageInfo:
      'It is possible to pass "all" as the name/id to start all currently stopped containers.\n  eg. supdock start all',
    allowFuzzySearching: true,
    parallelExecution: true,
  },
  stop: {
    description: 'Stop a running container',
    question: 'Which container would you like to stop?',
    error: 'no containers available to stop',
    flags: [
      ['f', 'force'],
      ['t', 'time'],
    ],
    type: CommandAlias.RUNNING_CONTAINERS,
    extraUsageInfo:
      'It is possible to pass "all" as the name/id to stop all currently running containers.\n  eg. `supdock stop all`',
    allowFuzzySearching: true,
    parallelExecution: true,
  },
  ssh: {
    description: 'SSH into a container',
    question: 'Which container would you like to SSH to?',
    error: 'no containers available',
    type: CommandAlias.RUNNING_CONTAINERS,
    custom: true,
    allowFuzzySearching: true,
  },
  cat: {
    description: 'Echo the contents of a file using cat on a container',
    question: 'Which container would you like to cat?',
    error: 'no containers available',
    type: CommandAlias.RUNNING_CONTAINERS,
    custom: true,
    allowFuzzySearching: true,
  },
  env: {
    description: 'See the environment variables of a running container',
    question:
      'Which container would you like to see the environment variables of?',
    error: 'no containers running',
    type: CommandAlias.RUNNING_CONTAINERS,
    custom: true,
    allowFuzzySearching: true,
  },
  rm: {
    description: 'Remove a container',
    question: 'Which container would you like to remove?',
    error: 'no containers to remove',
    flags: [
      ['f', 'force'],
      ['l', 'link'],
      ['v', 'volumes'],
    ],
    type: CommandAlias.STOPPED_CONTAINERS,
    allowFuzzySearching: true,
  },
  rmi: {
    description: 'Remove an image',
    question: 'Which image would you like to remove?',
    error: 'no images to remove',
    flags: [['f', 'force'], ['no-prune']],
    type: CommandAlias.IMAGES,
  },
  history: {
    description: 'See the history of an image',
    question: 'Which image would you like to see the history of?',
    error: 'no images available',
    flags: [['H', 'human'], ['q', 'quiet'], ['no-trunc']],
    type: CommandAlias.ALL_CONTAINERS,
    allowFuzzySearching: true,
  },
  stats: {
    description: 'See the stats of a container',
    question: 'Which containers would you like to see that stats of?',
    error: 'no containers available',
    flags: [['p', 'prompt']],
    type: CommandAlias.RUNNING_CONTAINERS,
    allowFuzzySearching: true,
  },
  inspect: {
    description: 'Inspect a container',
    question: 'Which image would you like to inspect?',
    error: 'no containers to inspect',
    flags: [['s', 'size']],
    type: CommandAlias.ALL_CONTAINERS,
    allowFuzzySearching: true,
  },
  prune: {
    description:
      'Remove stopped containers and dangling images. For more detailed usage refer to "docker system prune -h"',
    usage: 'system prune --help',
    flags: [['volumes'], ['a', 'all'], ['info']],
    custom: true,
  },
  enable: {
    description: 'Enable certain supdock functionality',
    custom: true,
    options: configOptions,
  },
  disable: {
    description: 'Disable certain supdock functionality',
    custom: true,
    options: configOptions,
  },
  top: {
    description: 'Display the running processes of a container',
    question: 'Which container would you like to see the running processes of?',
    type: CommandAlias.RUNNING_CONTAINERS,
    allowFuzzySearching: true,
  },
  port: {
    description: 'List port mappings or a specific mapping for the container',
    question: 'Which container would you like to see the the port mappings of?',
    type: CommandAlias.RUNNING_CONTAINERS,
    allowFuzzySearching: true,
  },
};

export default metadata;
