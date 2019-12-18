const yParser = require('yargs-parser');
const semver = require('semver');
const chalk = require('chalk');
const run = require('./lib/run');

const args = yParser(process.argv.slice(2));

if (args.v || args.version) {
    const pkg = require('./package.json');
    console.info(chalk.yellow(pkg.version));
    process.exit(0);
}

if (!semver.satisfies(process.version, '>= 8.0.0')) {
    console.info(chalk.red('node版本必须大于8.0.0'));
    process.exit(1);
}
const projectName = args._[0] || '';
const { type } = args;
delete args.type;
const cwd = process.cwd();

run({
    name: projectName,
    args,
    type,
    cwd,
})