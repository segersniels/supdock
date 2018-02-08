const _ = require('lodash');
const exec = require('child_process').exec;
const colors = require('colors/safe');
const inquirer = require('inquirer');

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
    const args = process.argv.slice(2).join(' ');
    execute(`docker ${args}`, false);
}

const prompt = (question, choices, command) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'container',
            message: question,
            choices: choices
        }
    ])
    .then(answers => {
        const id = answers.container.split('-')[0];
        execute(`docker ${command} ${id}`, false)
            .then(response => console.log(response));
    });
}

exports.logContainer = async () => {
    if (await getIds('psa') > 0) {
        const choices = createChoices(await getIds('psa'), await getNames('psa'));
        prompt('Which container would you like to see the logs of?', choices, 'logs');
    } else {
        console.log('No containers to see the logs of');
    }
}

exports.stopContainer = async () => {
    if (await getIds('ps') > 0) {
        const choices = createChoices(await getIds('ps'), await getNames('ps'));
        prompt('Which container would you like to stop?', choices, 'stop');
    } else {
        console.log('No containers running');
    }
}

exports.startContainer = async () => {
    if (await getIds('psaStopped') > 0) {
        const choices = createChoices(await getIds('psaStopped'), await getNames('psaStopped'));
        prompt('Which container would you like to start?', choices, 'start');
    } else {
        console.log('No containers available to start');
    }
}

exports.removeContainer = async () => {
    if (await getIds('psa') > 0) {
        const choices = createChoices(await getIds('psa'), await getNames('psa'));
        prompt('Which container would you like to remove?', choices, 'rm -f');
    } else {
        console.log('No containers to to remove');
    }
}

exports.removeImage = async () => {
    if (await getIds('images') > 0) {
        const choices = createChoices(await getIds('images'), await getNames('images'));
        prompt('Which image would you like to remove?', choices, 'rmi -f');
    } else {
        console.log('No images to remove');
    }
}

exports.statsContainer = async () => {
    if (await getIds('ps') > 0) {
        const choices = createChoices(await getIds('ps'), await getNames('ps'));
        prompt('Which containers would you like to see that stats of?', choices, 'stats --no-stream');
    } else {
        console.log('No containers running');
    }
}
