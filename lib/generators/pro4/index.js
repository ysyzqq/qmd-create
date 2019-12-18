const BaseGenerator = require('../../BaseGenerator');
class Generator extends BaseGenerator {
    prompting() { // yeo-man内置生命周期函数, 提示
      if (this.opts.args && 'isTypeScript' in this.opts.args && 'reactFeatures' in this.opts.args) {
        this.prompts = {
          isTypeScript: this.opts.args.isTypeScript,
          reactFeatures: this.opts.args.reactFeatures,
        };
      } else {
        const prompts = [
          {
            name: 'isTypeScript',
            type: 'confirm',
            message: 'Do you want to use typescript?',
            default: true,
          },
          {
            name: 'reactFeatures',
            message: 'What functionality do you want to enable?',
            type: 'checkbox',
            choices: [
              {name: 'antd', value: 'antd'},
              {name: 'dva', value: 'dva'},
              {name: 'code splitting', value: 'dynamicImport'},
              {name: 'dll', value: 'dll'},
              {name: 'internationalization', value: 'locale'},
            ],
          },
        ];
        return this.prompt(prompts).then(props => {
          this.prompts = props;
        });
      }
    }
  
    writing() { // 写入文件
      this.writeFiles({
        context: {
          name: this.name, // 项目名
          ...this.prompts, // 提示信息
        },
        filterFiles: f => { // 根据提示信息文件过滤
          const { isTypeScript, reactFeatures } = this.prompts;
          if (isTypeScript) {
            if (f.endsWith('.js')) return false;
            if (!reactFeatures.includes('dva')) {
              if (f.startsWith('src/models') || f === 'src/app.ts') return false;
            }
            if (!reactFeatures.includes('locale')) {
              if (f.startsWith('src/locales') || f.includes('umi-plugin-locale')) return false;
            }
          } else {
            if (this.isTsFile(f)) return false;
            if (!reactFeatures.includes('dva')) {
              if (f.startsWith('src/models') || f === 'src/app.js') return false;
            }
            if (!reactFeatures.includes('locale')) {
              if (f.startsWith('src/locales') || f.includes('umi-plugin-locale')) return false;
            }
          }
          return true;
        },
      });
    }
  }
  
  module.exports = Generator;
  