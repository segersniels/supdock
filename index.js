#!/usr/bin/env node
const package = require('./package.json');
const exec = require('./lib/exec.js');
const program = require('commander');

program.version(package.version);

const commands = ['start', 'stop', 'logs', 'ssh', 'update', 'stats', 'rm', 'rmi', '-h', '-v', '-V', '--help', '--version', 'help'];

if (commands.indexOf(process.argv[2]) >= 0) {
    program
        .command('stop')
        .description('Stop a running container')
        .action(() => {
            if (typeof process.argv[3] === 'undefined') exec.stopContainer();
            else exec.docker();
        });

    program
        .command('start')
        .description('Start a stopped container')
        .action(() => {
            if (typeof process.argv[3] === 'undefined') exec.startContainer();
            else exec.docker();
        });

    program
        .command('logs')
        .description('See the logs of a container')
        .action(() => {
            if (typeof process.argv[3] === 'undefined') exec.logContainer();
            else exec.docker();
        });

    program
        .command('rm')
        .description('Remove a container')
        .action(() => {
            if (typeof process.argv[3] === 'undefined') exec.removeContainer();
            else exec.docker();
        });

    program
        .command('rmi')
        .description('Remove an image')
        .action(() => {
            if (typeof process.argv[3] === 'undefined') exec.removeImage();
            else exec.docker();
        });

    program
        .command('stats')
        .description('See the stats of a container')
        .action(() => {
            if (typeof process.argv[3] === 'undefined') exec.statsContainer();
            else exec.docker();
        });

    program.parse(process.argv);
} else {
    exec.docker();
}
