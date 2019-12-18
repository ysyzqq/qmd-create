const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const chalk = require('chalk')

const generators = fs
    .readdirSync(`${__dirname}/generators`)
    .filter(dir => !dir.startsWith('.'))
    .map(dir => {
        return {
            name: `${dir.padEnd(10)}-----${chalk.yellow(require(`./generators/${dir}/meta.json`).description)}`,
            value: dir,
            absEntry: path.join(__dirname, `generators/${dir}/index.js`),
            short: dir
        }
    });

async function run({name, args, type, cwd = process.cwd()}) {
    // 用户没有指定type
    if (!type) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: 'Select the boilerplate type',
                choices: generators,
            }
        ])
        type = answers.type
    }
    try {
        return runGenerator(`./generators/${type}`, {name, args, cwd})
    } catch {
        console.error(chalk.red(`> Generate failed`), e);
        process.exit(1);    
    }
}
async function runGenerator(generatorPaht, config) {
    const {name, cwd, args} = config;
    if (name) { // 提供了项目目录

    }
}
module.exports = run;