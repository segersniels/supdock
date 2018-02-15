#!/usr/bin/env node
const package = require('./package.json');
const exec = require('./lib/exec.js');
const program = require('commander');
const spawn = require('child_process').spawn;
const _ = require('lodash');

program.version(package.version)
    .option('-f, --force')
    .option('-D, --debug')
    .option('-H, --host <list>')
    .option('-l, --log-level')
    .option('--config')
    .option('--no-stream');

program
    .command('stop')
    .description('Stop a running container')
    .action(() => {
        if (typeof process.argv[3] === 'undefined') {
            const question = 'Which container would you like to stop?';
            const error = 'No containers available to stop';
            exec.executeCommand('ps', question, 'stop', error);
        } else {
            exec.docker();
        }
    });

program
    .command('start')
    .description('Start a stopped container')
    .action(() => {
        if (typeof process.argv[3] === 'undefined') {
            const question = 'Which container would you like to start?';
            const error = 'No containers available to start';
            exec.executeCommand('psaStopped', question, 'start', error);
        } else {
            exec.docker();
        }
    });

program
    .command('logs')
    .description('See the logs of a container')
    .action(() => {
        if (typeof process.argv[3] === 'undefined') {
            const question = 'Which container would you like to see the logs of?';
            const error = 'No containers to see the logs of';
            exec.executeCommand('psa', question, 'logs', error);
        } else {
            exec.docker();
        }
    });

program
    .command('rm')
    .description('Remove a container')
    .action(() => {
        if (typeof process.argv[3] === 'undefined') {
            const question = 'Which container would you like to remove?';
            const error = 'No containers to remove';
            exec.executeCommand('psa', question, 'rm', error);
        } else {
            exec.docker();
        }
    });

program
    .command('rmi')
    .description('Remove an image')
    .action(() => {
        if (typeof process.argv[3] === 'undefined') {
            const question = 'Which image would you like to remove?';
            const error = 'No images to remove';
            exec.executeCommand('images', question, 'rmi', error);
        } else {
            exec.docker();
        }
    });

program
    .command('stats')
    .description('See the stats of a container')
    .action(() => {
        if (typeof process.argv[3] === 'undefined') {
            const question = 'Which containers would you like to see that stats of?';
            const error = 'No containers available';
            exec.executeCommand('ps', question, 'stats', error);
        } else {
            exec.docker();
        }
    });

program
    .command('ssh')
    .description('SSH into a container')
    .action(() => {
        if (typeof process.argv[3] === 'undefined') {
            const question = 'Which container would you like to SSH to?';
            const error = 'No containers available';
            exec.executeCommand('ps', question, 'ssh', error);
        } else {
            exec.docker();
        }
    });

program
    .command('history')
    .description('See the history of an image')
    .action(() => {
        if (typeof process.argv[3] === 'undefined') {
            const question = 'Which image would you like to see the history of?';
            const error = 'No images available';
            exec.executeCommand('images', question, 'history', error);
        } else {
            exec.docker();
        }
    });

program
    .command('env')
    .description('See the environment variables of a running container')
    .action(() => {
        if (typeof process.argv[3] === 'undefined') {
            const question = 'Which container would you like to see the environment variables of?';
            const error = 'No containers running';
            exec.executeCommand('ps', question, 'env', error);
        } else {
            exec.docker();
        }
    });


program
    .on('--help', () => {
        spawn('docker', ['help'], { stdio: 'inherit' });
    })
    .on('-h', () => {
        spawn('docker', ['help'], { stdio: 'inherit' });
    });

program.parse(process.argv);
const commands = _.map(program.commands, i => i._name);
if (commands.indexOf(process.argv[2]) <= -1) exec.docker();
