const Generator = require('yeoman-generator');
const glob = require('glob');
const { statSync } = require('fs');
const { basename } = require('path');
const debug = require('debug')('qmd-create:BasicGenerator');

function noop() {
  return true;
}
// 用来继承的base generator, yeoman里继承自父的方法不会自动执行
class BasicGenerator extends Generator {
  constructor(opts) {
    super(opts.args._, opts);
    this.opts = opts;
    this.name = basename(opts.env.cwd);
  }

  isTsFile(f) {
    return f.endsWith('.ts') || f.endsWith('.tsx') || !!/(tsconfig\.json|tslint\.yml)/g.test(f);
  }

  // 复制模板文件写入
  writeFiles({ context, filterFiles = noop }) {

    debug(`context: ${JSON.stringify(context)}`);
    glob
      .sync('**/*', { // 遍历所有文件
        cwd: this.templatePath(), // 默认是./templates
        dot: true,
      })
      .filter(filterFiles)
      .forEach(file => {
        debug(`copy ${file}`);
        const filePath = this.templatePath(file);
        if (statSync(filePath).isFile()) {
          this.fs.copyTpl(
            this.templatePath(filePath),
            this.destinationPath(file.replace(/^_/, '.')), // 生成目标文件
            context,
          );
        }
      });
  }

//   prompt(questions) {
//     process.send && process.send({ type: 'prompt' });
//     process.emit('message', { type: 'prompt' });
//     return super.prompt(questions);
//   }
}

module.exports = BasicGenerator;
