import _ from 'lodash';

const storage = (key: any, value: any, memory = localStorage) => {
  if (_.isPlainObject(key)) {
    _.forEach(key, (value, key) => {
      storage(key, value);
    });
  } else if (_.isString(key) && _.isNull(value)) {
    memory.removeItem(key);
  } else if (_.isString(key) && _.isUndefined(value)) {
    value = memory.getItem(key) || null;
    try {
      value = JSON.parse(value);
    } catch (e) {}
    return value;
  } else if (_.isString(key)) {
    try {
      value = JSON.stringify(value);
    } catch (e) {}
    memory.setItem(key, value);
  } else if (_.isNull(key)) {
    memory.clear();
  }
};
export default storage;
