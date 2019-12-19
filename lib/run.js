const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const chalk = require('chalk')
const clipboardy = require('clipboardy');

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
        await runGenerator(`./generators/${type}`, {name, args, cwd})
        let projectPath = cwd;
        if (name) {
            projectPath = path.join(cwd, name);
            process.chdir(projectPath)
        }
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isAutoInstall',
                message: 'Do you want to install dependencies?',
                default: false,
            }
        ])

        if (answers.isAutoInstall) {
            await execa('npm', ['install'], {});
        }
        console.log('✨ All Generate Done');
    } catch (e) {
        console.error(chalk.red(`> Generate failed`), e);
        process.exit(1);    
    }
}
async function runGenerator(generatorPath, config) {
    return new Promise((resolve) => {
        let { name, cwd, args } = config;
        if (name) { // 提供了项目目录
            cwd = path.join(cwd, name);
            fs.ensureDirSync(cwd); // 生成项目目录
        }
        const Generator = require(generatorPath);
        const generator = new Generator({
            env: {
                cwd,
            },
            name,
            args,
            resolved: require.resolve(generatorPath),
        });
        generator.run(() => {
            if (name) {
                if (process.platform !== `linux` || process.env.DISPLAY) {
                    clipboardy.writeSync(`cd ${name}`);
                    console.log('📋 Copied to clipboard, just use Ctrl+V');
                }
            }
            // todo auto npm install
            console.log('✨ File Generate Done');
            resolve(true)
        })
    })
}
module.exports = run;