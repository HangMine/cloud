import AnyFunction from './any-funtion.d';

export type AsyncFunction<T extends AnyFunction = AnyFunction> =
  (this: ThisParameterType<T>, ...args: Parameters<T>) => Promise<ReturnType<T>>;

export default AsyncFunction;
