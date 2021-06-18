/**
 * 同时运行这些校验器，如果有错误，则抛出第一个
 * @param fns 校验器
 */
export function all(fns: Function[]) {
  return function doAll(this: any, ...args: any[]) {
    const errors = [];
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i];
      try {
        fn.call(this, ...args);
      } catch (e) {
        errors.push(e);
      }
    }
    if (errors.length) {
      throw errors[0];
    }
  };
}

export default all;
