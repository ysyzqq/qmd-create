import { IRoute } from 'umi-types';

const routes: IRoute[] = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login/index.tsx',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            name: '首页',
            path: '/welcome',
            icon: 'smile',
            component: './home/Welcome.tsx',
            authority: 2
          },
          {
            component: './exception/404',
          },
        ],
      },
      {
        component: './exception/404',
      },
    ],
  },

  {
    component: './exception/404',
  },
];

export { routes };
