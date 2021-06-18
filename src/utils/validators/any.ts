/**
 * 运行所有校验器，如果有错误，则抛出错误
 * @param fns 校验器
 */
export function any(fns: Function[]) {
  return function doAny(this: any, ...args: any[]) {
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i];
      fn.call(this, ...args);
    }
  };
}

export default any;
