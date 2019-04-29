"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const inquirer = require("inquirer");
class Supdock {
    executeFullyDeclaredCommand(command) {
        return child_process_1.execSync(command, { maxBuffer: 1024 * 10000 })
            .toString()
            .split('\n')
            .filter(line => line);
    }
    getNames(type) {
        switch (type) {
            case 'psa':
                return this.executeFullyDeclaredCommand("docker ps -a |awk '{print $NF}' |tail -n +2" /* ALL_CONTAINER_NAMES */);
            case 'ps':
                return this.executeFullyDeclaredCommand("docker ps |awk '{print $NF}' |tail -n +2" /* RUNNING_CONTAINER_NAMES */);
            case 'psaStopped':
                return this.executeFullyDeclaredCommand("docker ps -a |grep 'Exited' |awk '{print $NF}'" /* ALL_STOPPED_CONTAINER_NAMES */);
            case 'images':
                return this.executeFullyDeclaredCommand("docker images |awk '{print $1}' |tail -n +2" /* IMAGE_NAMES */);
            default:
                return;
        }
    }
    getIds(type) {
        switch (type) {
            case 'psa':
                return this.executeFullyDeclaredCommand("docker ps -a |awk '{print $1}' |tail -n +2" /* ALL_CONTAINER_IDS */);
            case 'ps':
                return this.executeFullyDeclaredCommand("docker ps |awk '{print $1}' |tail -n +2" /* RUNNING_CONTAINER_IDS */);
            case 'psaStopped':
                return this.executeFullyDeclaredCommand("docker ps -a |grep 'Exited' |awk '{print $1}'" /* ALL_STOPPED_CONTAINER_IDS */);
            case 'images':
                return this.executeFullyDeclaredCommand("docker images |awk '{print $3}' |tail -n +2" /* IMAGE_IDS */);
            default:
                return;
        }
    }
    createChoices(ids, names) {
        return ids.map((id, index) => `${id} - ${names[index]}`);
    }
    spawn(command, args) {
        child_process_1.spawnSync(command, args, { stdio: 'inherit' });
    }
    ssh(id) {
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'shell',
                message: 'Which shell is the container using?',
                choices: ['bash', 'ash'],
            },
        ])
            .then((shell) => {
            this.spawn('docker', ['exec', '-ti', id.trim(), shell.shell]);
        });
    }
    prompt(question, choices, command) {
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'container',
                message: question,
                choices: choices,
            },
        ])
            .then((answers) => {
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
    passthrough(options = process.argv.slice(2)) {
        this.spawn('docker', options);
    }
    execute(command, question, error, type) {
        const ids = this.getIds(type);
        if (ids.length > 0) {
            const choices = this.createChoices(ids, this.getNames(type));
            this.prompt(question, choices, command);
        }
        else {
            throw new Error(error);
        }
    }
    async executeInParallel(command, type) {
        const ids = this.getIds(type);
        return Promise.all(ids.map(id => {
            return new Promise(resolve => {
                resolve(child_process_1.spawn('docker', [command, id]));
            });
        }));
    }
}
exports.default = Supdock;
//# sourceMappingURL=supdock.js.map