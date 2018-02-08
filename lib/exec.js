const _ = require('lodash');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const inquirer = require('inquirer');

const getIds = type => {
    return new Promise((resolve, reject) => {
        switch (type) {
            case 'psa':
                resolve(executeArray(`docker ps -a |awk '{print $1}' |tail -n +2`));
                break;
            case 'ps':
                resolve(executeArray(`docker ps |awk '{print $1}' |tail -n +2`));
                break;
            case 'psaStopped':
                resolve(executeArray(`docker ps -a |grep 'Exited' |awk '{print $1}'`));
                break;
            case 'images':
                resolve(executeArray(`docker images |awk '{print $3}' |tail -n +2`));
                break;
        }
    });
}

const getNames = async type => {
    return new Promise((resolve, reject) => {
        switch (type) {
            case 'psa':
                resolve(executeArray(`docker ps -a |awk '{print $NF}' |tail -n +2`));
                break;
            case 'ps':
                resolve(executeArray(`docker ps |awk '{print $NF}' |tail -n +2`));
                break;
            case 'psaStopped':
                resolve(executeArray(`docker ps -a |grep 'Exited' |awk '{print $NF}'`));
                break;
            case 'images':
                resolve(executeArray(`docker images |awk '{print $1}' |tail -n +2`));
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

const executeArray = command => {
    return new Promise((resolve, reject) => {
        exec(command, {maxBuffer: 1024 * 10000}, (err, stdout, stderr) => {
            if (stderr) reject(stderr);
            resolve(_.compact(stdout.split('\n')));
        });
    });
}

const execute = args => {
    spawn('docker', args, { stdio: 'inherit' });
}

exports.docker = () => {
    const args = process.argv.slice(2);
    execute(args);
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
                execute(['exec', '-ti', id.trim(), shell.shell]);
            });
        }
        else {
            execute([ command, id ]);
        }
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
        prompt('Which containers would you like to see that stats of?', choices, 'stats');
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
