/**
 * 运行所有校验器，如果所有都错误，则抛出第一个错误
 * @param fns 校验器
 */
export function some(fns: Function[]) {
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
    if (errors.length === fns.length) {
      throw errors[0];
    }
  };
}

export default some;
