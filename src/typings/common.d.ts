
type Obj = Record<string | number, any>;
type GetArrayItem<T> = T extends Array<infer I> ? I : T;
type AsyncReturnType<T> = ReturnType<T> extends Promise<infer P> ? P : ReturnType<T>;
type TableData<T = Obj> = {
  total: number,
  current: number,
  size: number,
  records: T[]
};
type valueof<T> = T[keyof T];

declare module '*.json' {
  const value: any;
  export default value;
}
