import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { getPageQuery } from '@/utils/utils';
import { session, redirectToLogin } from '@/utils/';
import Cookie from 'js-cookie';
export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(ssoLogin, payload);
      // Login successfully
      if (response.code === 0) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    
    *logout(_, { put, call }) {
      // yield call(logout);
      // 清空cookie和session
      redirectToLogin()
      
      // 清空user model
      yield put({
        type: 'user/clearCurrentUser',
      });
    },
  },

  reducers: {
  },
};

export default Model;
