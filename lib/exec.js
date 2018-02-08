const _ = require('lodash');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const colors = require('colors/safe');
const inquirer = require('inquirer');
const pty = require('pty.js');

const execute = (command, array) => {
    return new Promise((resolve, reject) => {
        if (array) {
            exec(command, {maxBuffer: 1024 * 10000}, (err, stdout, stderr) => {
                resolve(_.compact(stdout.split('\n')));
            });
        } else {
            exec(command, {maxBuffer: 1024 * 10000}, (err, stdout, stderr) => {
                if (stderr) console.log(stderr);
                resolve(stdout);
            });
        }
    });
}

const getIds = type => {
    return new Promise((resolve, reject) => {
        switch (type) {
            case 'psa':
                resolve(execute(`docker ps -a |awk '{print $1}' |tail -n +2`, true));
                break;
            case 'ps':
                resolve(execute(`docker ps |awk '{print $1}' |tail -n +2`, true));
                break;
            case 'psaStopped':
                resolve(execute(`docker ps -a |grep 'Exited' |awk '{print $1}'`, true));
                break;
            case 'images':
                resolve(execute(`docker images |awk '{print $3}' |tail -n +2`, true));
                break;
        }
    });
}

const getNames = async type => {
    return new Promise((resolve, reject) => {
        switch (type) {
            case 'psa':
                resolve(execute(`docker ps -a |awk '{print $NF}' |tail -n +2`, true));
                break;
            case 'ps':
                resolve(execute(`docker ps |awk '{print $NF}' |tail -n +2`, true));
                break;
            case 'psaStopped':
                resolve(execute(`docker ps -a |grep 'Exited' |awk '{print $NF}'`, true));
                break;
            case 'images':
                resolve(execute(`docker images |awk '{print $1}' |tail -n +2`, true));
                break;
        }
    });
}

const createChoices = (ids, names) => {
    let choices = [];
    _.forEach(ids, (id, index) => {
        choices.push(`${id} - ${names[index]}`);
    });
    return choices;
}

exports.docker = () => {
    const args = process.argv.slice(2);
    spawn('docker', args, { stdio: 'inherit' });
}

const prompt = (question, choices, command, ssh) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'container',
            message: question,
            choices: choices
        }
    ])
    .then(answers => {
        const id = answers.container.split('-')[0].trim();
        if (command === 'ssh') {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'shell',
                    message: 'Which shell is the container using?',
                    choices: ["bash", "ash"]
                }
            ])
            .then(shell => {
                spawn('docker', ['exec', '-ti', id.trim(), shell.shell], { stdio: 'inherit' });
            });
        }
        else execute(`docker ${command} ${id}`, false)
            .then(response => console.log(response));
    });
}

exports.logContainer = async () => {
    const ids = await getIds('psa');
    if (ids.length > 0) {
        const choices = createChoices(ids, await getNames('psa'));
        prompt('Which container would you like to see the logs of?', choices, 'logs');
    } else {
        console.log('No containers to see the logs of');
    }
}

exports.stopContainer = async () => {
    const ids = await getIds('ps');
    if (ids.length > 0) {
        const choices = createChoices(ids, await getNames('ps'));
        prompt('Which container would you like to stop?', choices, 'stop');
    } else {
        console.log('No containers running');
    }
}

exports.startContainer = async () => {
    const ids = await getIds('psaStopped');
    if (ids.length > 0) {
        const choices = createChoices(ids, await getNames('psaStopped'));
        prompt('Which container would you like to start?', choices, 'start');
    } else {
        console.log('No containers available to start');
    }
}

exports.removeContainer = async () => {
    const ids = await getIds('psa');
    if (ids.length > 0) {
        const choices = createChoices(ids, await getNames('psa'));
        prompt('Which container would you like to remove?', choices, 'rm -f');
    } else {
        console.log('No containers to to remove');
    }
}

exports.removeImage = async () => {
    const ids = await getIds('images');
    if (ids.length > 0) {
        const choices = createChoices(ids, await getNames('images'));
        prompt('Which image would you like to remove?', choices, 'rmi -f');
    } else {
        console.log('No images to remove');
    }
}

exports.statsContainer = async () => {
    const ids = await getIds('ps');
    if (ids.length > 0) {
        const choices = createChoices(ids, await getNames('ps'));
        prompt('Which containers would you like to see that stats of?', choices, 'stats --no-stream');
    } else {
        console.log('No containers running');
    }
}

exports.sshContainer = async () => {
    const ids = await getIds('ps');
    if (ids.length > 0) {
        const choices = createChoices(ids, await getNames('ps'));
        prompt('Which container would you like to SSH to?', choices, 'ssh');
    } else {
        console.log('No containers running');
    }
}
