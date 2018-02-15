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

const execute = (command, args) => {
    spawn(command, args, { stdio: 'inherit' });
}

exports.docker = () => {
    const args = process.argv.slice(2);
    execute('docker', args);
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
                execute('docker', [ 'exec', '-ti', id.trim(), shell.shell ]);
            });
        }
        else {
            switch (command) {
                case 'stats':
                    execute('docker', [ command, id, '--no-stream' ]);
                    break;
                case 'env':
                    execute('docker', [ 'exec', '-ti', id, 'env' ]);
                    break;
                default:
                    execute('docker', [ command, id ]);
            }
        }
    });
}

exports.executeCommand = async (type, question, command, error) => {
    const ids = await getIds(type);
    if (ids.length > 0) {
        const choices = createChoices(ids, await getNames(type));
        prompt(question, choices, command);
    } else {
        console.log(error);
    }
}

const findComposeProjects = () => {
    return new Promise((resolve, reject) => {
        exec(`find ${process.env.HOME} -maxdepth 5 -type f -name 'docker-compose.yml'`, (err, stdout, stderr) => {
            if (stderr) reject(stderr);
            const stdarr = stdout.split('\n');
            const projects = _.compact(stdarr);
            resolve(projects);
        });
    });
}

const createComposeChoices = projects => {
    let choices = [];
    _.forEach(projects, project => {
        choices.push(`${project.split('/').pop()} (${project})`);
    });
    return choices;
}

const composePrompt = (question, projects, action) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'project',
            message: question,
            choices: projects
        }
    ])
    .then(answer => {
        const file = answer.project.match(/\((.*?)\)/)[1];
        switch (action) {
            case 'start':
                execute('docker-compose', [ '-f' , `${file}/docker-compose.yml` , 'up', '-d' ]);
                break;
            case 'stop':
                execute('docker-compose', [ '-f', `${file}/docker-compose.yml`, 'stop' ]);
                break;
        }
    });
}

exports.executeCompose = async (question, action, error) => {
    if (typeof action === 'undefined') console.error('No action was specified');
    if (typeof action !== 'undefined' && action !== 'start' && action !== 'stop') {
        console.error(`supdock: ${action} is not a valid action`);
    } else {
        const projects = await findComposeProjects();
        _.forEach(projects, (project, index) => {
            projects[index] = project.replace('/docker-compose.yml','');
        });
        if (projects.length > 0) {
            const choices = createComposeChoices(projects);
            composePrompt(question, choices.sort(), action);
        } else {
            console.log(error);
        }
    }
}
