
export interface ArrayLikeWritable<T> {
  readonly length: number;
  [n: number]: T;
}
export default ArrayLikeWritable;
