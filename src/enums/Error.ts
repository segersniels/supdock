enum Error {
  NoLogContainers = 'No containers to see the logs of',
  NoRestartContainers = 'No containers available to restart',
  NoStartContainers = 'No containers available to start',
  NoStopContainers = 'No containers available to stop',
  NoRemoveContainers = 'No containers available to remove',
  NoRemoveImages = 'No images available to remove',
  NoContainers = 'No containers available',
  NoImages = 'No images available',
  NoSearchMatch = 'Was not able to match with container or image for search',
  ExitOnUserRequest = 'Exiting on request of user',
  InvalidChoices = 'Unable to generate choices to execute command',
  NoConfigOptionsFound = 'No related config options found',
}

export default Error;
