
function own<T extends Object, K extends PropertyKey>(target: T, key: K): target is Extract<T, {[k in K]: unknown}> {
  return Object.prototype.hasOwnProperty.call(target, key);
}
function has<T extends Object, K extends PropertyKey>(target: T, key: K): target is Extract<T, {[k in K]: Exclude<unknown, undefined>}> {
  return own(target, key) && target[key] !== undefined;
}
export { own, has };
export default own;
