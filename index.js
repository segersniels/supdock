#!/usr/bin/env node
const package = require('./package.json');
const exec = require('./lib/exec.js');
const program = require('commander');
const _ = require('lodash');

program.version(package.version);

//const commands = ['start', 'stop', 'logs', 'ssh', 'update', 'stats', 'rm', 'rmi', '-h', '-v', '-V', '--help', '--version', 'help'];


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

program
    .command('ssh')
    .description('SSH into a container')
    .action(() => {
        if (typeof process.argv[3] === 'undefined') exec.sshContainer();
        else exec.docker();
    });

program.parse(process.argv);
const commands = _.map(program.commands, i => i._name);
if (commands.indexOf(process.argv[2]) <= -1) exec.docker();
