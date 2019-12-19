import { Effect } from 'dva';
import { Reducer } from 'redux';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { queryCurrent } from '@/services/user';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
  givenName?: string;
  username?: string;
  account?: string;
  permissions?: number[];
}

export interface UserModelState {
  currentUser: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    clearCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const { data } = yield call(queryCurrent);
      const { list: visualPermissions = [], ...currentUser } = data;
      // 刷新权限和权限路由组件
      setAuthority(visualPermissions);
      reloadAuthorized();
      const mapCurrentUser = {
        ...currentUser,
        permissions: [...visualPermissions],
        username: currentUser.account,
        givenName: currentUser.name,
      }
      yield put({
        type: 'saveCurrentUser',
        payload: {...mapCurrentUser},
      });
    },
  },

  reducers: {
    saveCurrentUser(state, {payload}) {
      return {
        ...state,
        currentUser: {...payload},
      };
    },
    clearCurrentUser(state) {
      return {
        ...state,
        currentUser: {}
      }
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
