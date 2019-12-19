const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');
const prettier = require('prettier');
const sylvanas = require('sylvanas');
const sortPackage = require('sort-package-json');
const execa = require('execa');
const chalk = require('chalk');
const BaseGenerator = require('../../BaseGenerator');

function globList(patterns, options) {
    let fileList = [];
    patterns.forEach(pattern => {
        fileList.push(...glob.sync(pattern, options))
    })
    return fileList;
}
function log(...args) {
    console.log(`${chalk.gray('>')}`, ...args);
}
function getGithubUrl() {
    return 'https://github.com/ant-design/ant-design-pro'
}
function filterPkg(pkgObject, ignoreList) {
    const devObj = {};
    Object.keys(pkgObject).forEach(key => {
      const isIgnore = ignoreList.some(reg => {
        return new RegExp(reg).test(key);
      });
      if (isIgnore) {
        return;
      }
      devObj[key] = pkgObject[key];
    });
    return devObj;
};

class AntDesignProGenerator extends BaseGenerator {

    prompting() {
        if (this.opts.args.language) {
            this.prompts = {
                language: this.opts.args.language,
            };
        } else {
            const prompts = [
                {
                    name: 'language',
                    type: 'list',
                    message: 'Which language do you want to use?',
                    choices: ['TypeScript', 'JavaScript'],
                },
            ];
            return this.prompt(prompts).then(props => {
                this.prompts = props;
            });
        }
    }

    async writing() {
        const { language } = this.prompts;
        const isTypeScript = language === 'TypeScript';

        const projectName = this.opts.name || this.opts.env.cwd;
        const projectPath = this.opts.env.cwd;

        const envOptions = {
            cwd: projectPath,
        };

        const githubUrl = await getGithubUrl();
        const gitArgs = [`clone`, githubUrl, `--depth=1`];

        // Set branch if provided
        if (this.opts.args.branch) {
            gitArgs.push('--branch', this.opts.args.branch);
        }

        gitArgs.push(projectName);

        // Clone remote branch
        log(`git ${gitArgs.join(' ')}`);
        await execa(`git`, gitArgs);

        const packageJsonPath = path.resolve(projectPath, 'package.json');
        const pkg = require(packageJsonPath);
        // Handle js version
        if (!isTypeScript) {
            log('[Sylvanas] Prepare js environment...');
            const tsFiles = globList(['**/*.tsx', '**/*.ts'], {
                ...envOptions,
                ignore: ['**/*.d.ts'],
            });

            sylvanas(tsFiles, {
                ...envOptions,
                action: 'overwrite',
            });

            log('[JS] Clean up...');
            const removeTsFiles = globList(['tsconfig.json', '**/*.d.ts'], envOptions);
            removeTsFiles.forEach(filePath => {
                const targetPath = path.resolve(projectPath, filePath);
                fs.removeSync(targetPath);
            });
        }

        // copy readme
        const babelConfig = path.resolve(__dirname, 'README.md');
        fs.copySync(babelConfig, path.resolve(projectPath, 'README.md'));

        // gen package.json
        if (pkg['create-umi']) {
            const { ignoreScript = [], ignoreDependencies = [] } = pkg['create-umi'];
            // filter scripts and devDependencies
            const projectPkg = {
                ...pkg,
                version: '1.0.0',
                scripts: filterPkg(pkg.scripts, ignoreScript),
                devDependencies: filterPkg(pkg.devDependencies, ignoreDependencies),
            };
            // remove create-umi config
            delete projectPkg['create-umi'];
            fs.writeFileSync(
                path.resolve(projectPath, 'package.json'),
                // 删除一个包之后 json会多了一些空行。sortPackage 可以删除掉并且排序
                // prettier 会容忍一个空行
                prettier.format(JSON.stringify(sortPackage(projectPkg)), {
                    parser: 'json',
                }),
            );
        }

        // Clean up useless files
        if (pkg['create-umi'] && pkg['create-umi'].ignore) {
            log('Clean up...');
            const ignoreFiles = pkg['create-umi'].ignore;
            const fileList = globList(ignoreFiles, envOptions);

            fileList.forEach(filePath => {
                const targetPath = path.resolve(projectPath, filePath);
                fs.removeSync(targetPath);
            });
        }
    }
}

module.exports = AntDesignProGenerator;
