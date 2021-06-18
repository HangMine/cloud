export type Mode = 'fit' | 'contain' | 'cover';
export type ThumbOptions = {
  mode?: Mode,
  maxRatio?: number,
  width?: number,
  height?: number,
  outType?: string,
  default?: string
  backgroundColor?: string
};
