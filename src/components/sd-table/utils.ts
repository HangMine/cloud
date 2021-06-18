import { Obj, Column, Columns } from './type';

const _toString = Object.prototype.toString;
export const toRawType = (value:any) => _toString.call(value).slice(8, -1);

// 根据类型设置默认值
export const getInitValue = (value:any) => {
  const type = toRawType(value);
  switch (type) {
    case 'Array':
      return [];
    case 'Object':
      return {};
    case 'Date':
      return new Date();
    case 'Number':
      return 0;
    case 'Null':
    case 'Undefined':
    case 'Function':
      return value;
    default:
      return '';
  }
};

export const getInitObj = (originObj:Obj = {}, preValueObj:Obj = {}) => {
  const obj:Obj = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(originObj)) {
    // eslint-disable-next-line no-prototype-builtins
    obj[key] = preValueObj.hasOwnProperty(key) ? preValueObj[key] : getInitValue(value);
  }
  return obj;
};

/**
 * @des: 深复制(es6，不添加原型版本)，需考虑循环引用对象的兼容处理:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
 * @param {Any} data 需要复制的数据
 * @param {Array} cache 保存已经遍历过的对象，是为了处理循环引用对象
 * @return {Any} 复制后的数据
 */
export const deepCopy = (obj:any, cache:{original:Obj, copy:Obj}[] = []) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  const hit = cache.filter(c => c.original === obj)[0];
  if (hit) {
    return hit.copy;
  }
  const copy:Obj = Array.isArray(obj) ? [] : {};
  cache.push({
    original: obj,
    copy,
  });
  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache);
  });
  return copy;
};

/**
 * @description:
 * @param {Number | String} num
 * @return
 */
export const getPx = (num:number|string) => (toRawType(num) === 'Number' ? `${num}px` : num);

/**
 * @description: 复制内容到剪贴版
 * @param {String} val 需要复制的内容
 * @return:
 */
export const copy = (val:string) => {
  // 使用textarea才可以换行
  const textarea = document.createElement('textarea');
  textarea.value = val;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('Copy');
  return textarea.parentNode?.removeChild(textarea);
};

export const getColumnKeys = (column:Column) => {
  if (!column.children) return [column.key];

  const keys:string[] = [];
  const helper = (arr:Columns) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of arr) {
      if (item.children) helper(item.children);
      keys.push(item.key);
    }
  };
  helper(column.children);
  return keys;
};
