import { execSync, spawnSync, spawn } from 'child_process';
import * as inquirer from 'inquirer';
import { NameCommands, IdCommands } from './enums';
import Type from './types/type';
import { logAndForget } from './helpers/logger';
import { version } from '../package.json';

export default class Supdock {
  private commands: any;

  constructor() {
    this.commands = {
      logs: 'See the logs of a container',
      restart: 'Restart a running container',
      start: 'Start a stopped container',
      stop: 'Stop a running container',
      ssh: 'SSH into a container',
      env: 'See the environment variables of a running container',
      rm: 'Remove a container',
      rmi: 'Remove an image',
      history: 'See the history of an image',
      stats: 'See the stats of a container',
      inspect: 'Inspect a container',
      prune:
        "Remove stopped containers and dangling images. For more detailed usage refer to 'docker system prune -h'",
      // compose: 'Allows for dynamic docker-compose usage',
    };
  }

  private generateCommandDescriptions() {
    const commands = Object.keys(this.commands);
    return commands
      .map(command => `\t${command}\t\t${this.commands[command]}`)
      .join('\n');
  }

  private executeFullyDeclaredCommand(command: string): string[] {
    return execSync(command, { maxBuffer: 1024 * 10000 })
      .toString()
      .split('\n')
      .filter(line => line);
  }

  private getDockerInfo(type: Type) {
    const ids = this.executeFullyDeclaredCommand(IdCommands[type]);
    const names = this.executeFullyDeclaredCommand(NameCommands[type]);
    return { ids, names };
  }

  private createChoices(ids: string[], names: string[]) {
    return ids.map((id: string, index: number) => `${id} - ${names[index]}`);
  }

  private spawn(command: string, args: string[]) {
    spawnSync(command, args, { stdio: 'inherit' });
    process.exit(0);
  }

  private ssh(id: string) {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'shell',
          message: 'Which shell is the container using?',
          choices: ['bash', 'ash'],
        },
      ])
      .then((shell: any) => {
        this.spawn('docker', ['exec', '-ti', id.trim(), shell.shell]);
      });
  }

  private prompt(question: string, choices: string[], command: string) {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'container',
          message: question,
          choices: choices,
        },
      ])
      .then((answers: any) => {
        const id = answers.container.split('-')[0].trim();
        switch (command) {
          case 'ssh': {
            this.ssh(id);
            break;
          }
          case 'stats':
            this.spawn('docker', [command, id, '--no-stream']);
            break;
          case 'env':
            this.spawn('docker', ['exec', '-ti', id, 'env']);
            break;
          default:
            this.spawn('docker', [command, id]);
        }
      });
  }

  public default(options: string[] = process.argv.slice(2)) {
    this.spawn('docker', options);
  }

  public execute(command: string, question: string, error: string, type: Type) {
    const { ids, names } = this.getDockerInfo(type)!;
    if (ids.length > 0) {
      const choices = this.createChoices(ids, names);
      this.prompt(question, choices, command);
    } else {
      throw new Error(error);
    }
  }

  public async executeInParallel(command: string, type: Type) {
    const { ids } = this.getDockerInfo(type)!;
    return Promise.all(
      ids.map(id => {
        return new Promise(resolve => {
          resolve(spawn('docker', [command, id]));
        });
      }),
    );
  }

  public usage() {
    const commandDescriptions = this.generateCommandDescriptions();
    logAndForget(`NAME:
\tsupdock - What's Up Dock(er)?

USAGE:
\tsupdock [global options] command [command options] [arguments...]

VERSION:
\t${version}

COMMANDS:
${commandDescriptions}
\thelp, h\t\tShows a list of commands or help for one command

GLOBAL OPTIONS:
\t--help, -h\tshow help
\t--version, -v\tprint the version
    `);
  }

  public version() {
    logAndForget(`supdock version ${version}`);
  }

  public getCustomCommands() {
    return Object.keys(this.commands);
  }
}
