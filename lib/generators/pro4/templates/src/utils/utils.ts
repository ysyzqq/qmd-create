import qs from 'querystring';
import moment, {Moment} from 'moment';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => qs.parse(window.location.href.split('?')[1]);



export const safePath = (path) => `/${path}`.replace(/\/+/g, '/');

// <-----Human
// Tree data转化

export const toTreeData = (
  treeData = [],
  { id = 'id', pId = 'parentId', title = 'title', rootPId = 0, ...restParams }
) => {
  const tree = (data, parentId) =>
    data
      .filter(item => item[pId] === parentId)
      .map(node => {
        const children = tree(data, node[id]);
        const restObj = {};
        Object.keys(restParams).forEach(k => {
          if (Reflect.has(restParams, k)) {
            restObj[k] =
              typeof restParams[k] == 'function' ? restParams[k](node) : node[restParams[k]];
          }
        });
        return {
          ...node,
          ...restObj,
          id: node[id],
          key: node[id],
          title: node[title],
          parentId: node[pId],
          children: children.length ? children : undefined,
        };
      });
  return tree(treeData, rootPId);
};

export const flattenArray = arr => {
  const result = [];
  const flatten = arr => arr.forEach(i => (Array.isArray(i) ? flatten(i) : result.push(i)));
  flatten(arr);
  return result;
};

export const flatten = (arr, depth = 1) =>
  arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v), []);

// export const toTreeData = (treeData = [], { id = 'id', pId = 'parentId', title = 'title', rootPId = 0 }) => {
//   return treeData.filter(item => (item[pId] === rootPId)).map(node => {
//     const children = toTreeData(treeData, { id, pId, title, rootPId: node[id] });
//     return {
//       ...node,
//       key: node[id],
//       title: node[title],
//       children: children.length ? children : undefined,
//     };
//   });
// }

export const getBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();
  const check = r => r.test(ua);
  return (
    (check(/firefox/) && 'Firefox') ||
    (check(/edge/) && 'Edge') ||
    (check(/opera/) && 'Opera') ||
    (check(/chrome/) && 'Chrome') ||
    (check(/safari/) && 'Safari') ||
    ((check(/msie/) || check(/trident/)) && 'IE')
  );
};

export const copy = (str, cb) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  cb && cb();
};

// export const getTextWidth = (text, fontSize = 12) => {
//   const fontFamily =
//     "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
//   const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
//   const context = canvas.getContext('2d');
//   context.font = `${fontSize}px ${fontFamily}`;
//   console.log('font', `${fontSize}px ${fontFamily}`)
//   const metrics = context.measureText(text);
//   return metrics.width;
// };

export const getTextWidth = (str, fontSize = 12) => {
  const fontFamily =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
  const span = document.createElement('span');
  span.style.font = `${fontSize}px ${fontFamily}`;
  span.style.lineHeight = '1.5';
  span.innerHTML = str;
  document.body.appendChild(span);
  const rect = span.getBoundingClientRect();
  const { width } = rect;
  document.body.removeChild(span);
  return width;
};
// Human----->

export const dateFormat = (target, format = 'YYYY-MM-DD') => {
  if (!target) return target;
  return moment(target).format(format);
};

export const fmoney = (num, len) => {
  /*
   * 参数说明：
   * s：要格式化的数字
   * n：保留几位小数
   * */
  let s = num;
  if (!num) {
    return num === 0 ? 0 : '';
  }
  const n = len > 0 && len <= 20 ? len : 2;
  s = `${parseFloat(`${s}`.replace(/[^\d\.-]/g, '')).toFixed(n)}`;
  const l = s
    .split('.')[0]
    .split('')
    .reverse();
  const r = s.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
  }

  const res = `${t
    .split('')
    .reverse()
    .join('')}.${r}`;

  return res.replace('-,', '-');
};

// string
export const toSnake = (str: string, char = '_') => {
  return str.replace(/([A-Z])/g, function ($1) {
    return char + $1.toLowerCase();
  });
}
/** Date相关 */
export const formatRangeDate = (dates: Moment[], format: string = 'YYYY-MM-DD HH:mm:ss'): any[] => {
  if (!dates.length) return [];
  let validDates = dates.filter(val => moment.isMoment(val));
  if (!validDates.length || validDates.length !== 2) return validDates.map(val => val.format(format));
  let res: string[] = [];
  res[0] = validDates[0].startOf('day').format(format)
  res[1] = validDates[1].endOf('day').format(format)
  return res;
}