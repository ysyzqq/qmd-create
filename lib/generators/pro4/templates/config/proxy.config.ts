const [, , , senv = 'dev'] = process.argv;

const domains = {
  dev: {
    api: '',
    sso: '',
  },
};

const domain = domains[senv];
export default {
    '/manage/': {
      target: domain.api,
      pathRewrite: {
        '^/manage/': '/manage/',
      },
      changeOrigin: true,
    },
    '/sso/': {
      target: domain.sso,
      pathRewrite: {
        '^/sso/': '/',
      },
      changeOrigin: true,
    },
};
