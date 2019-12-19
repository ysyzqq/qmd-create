import qs from 'qs';
import Cookie from 'js-cookie';
import storage from './storage';
import { isUrl } from './utils';
export { default as request } from './request';
export const safePath = path => `/${path}`.replace(/\/+/g, '/');
export const redirectTo = (path, query = {}) => {
  if (!isUrl(path)) {
    const pathArray = path.split('?redirect=');
    path = pathArray[1] || pathArray[0] || '/';
    path = `${safePath(path)}`;
    query = qs.stringify(query);
    if (query) path += `?${query}`;
  }
  window.location.href = path;
};
// 从当前url上获取当前的开发环境, dev,qa,线上

export const session = (key, value?) => {
  return storage(key, value, sessionStorage);
};

export const redirectToLogin = () => {
  let redirect = `${location.pathname}${location.search}`;
  redirect = redirect ? redirect : '/';
  session(null);
  // console.info(redirect, '--')
  if (redirect.indexOf('/user/login') < 0) {
    redirect = encodeURIComponent(redirect);
    redirectTo('/user/login', { redirect });
  }
};
