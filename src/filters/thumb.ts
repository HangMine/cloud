import {
  isOssUrl, thumb as ossThumb,
} from '@/utils/oss/utils';
import isDataPipeUrl from '@/utils/is-data-pipe-url';
import { ThumbOptions as ThumbOptionsType } from '@/typings/thumb-options.d';
// 阿里云oss文件缩略图地址获取

const alias = {
  full: 1600,
  large: 960,
  medium: 480,
  small: 280,
  tiny: 120,
  micro: 48,
};
type SizeAliasType = keyof typeof alias;

const rStyle = /(?:xs|s|m|l|xl|xxl)_(?:contain|cover|fill)/;

type SizeConfigType = { width: number, height: number };
const defaultOptions = {
  mode: 'fit',
  maxRatio: 1,
  width: alias.small,
  height: alias.small,
  // outType: 'image/jpg',
  default: undefined,
};


function isSzSizeAlias(target: string): target is SizeAliasType {
  return target in alias;
}

function normalizeParams(config: ThumbOptionsType): ThumbOptionsType;
function normalizeParams(size: number, crop?: boolean, defaultImg?: string): ThumbOptionsType;
function normalizeParams(
  sizeAlias: SizeAliasType, crop?: boolean, defaultImg?: string): ThumbOptionsType;
function normalizeParams(
  sizeObject: SizeConfigType, crop?: boolean, defaultImg?: string): ThumbOptionsType;
function normalizeParams(style: string, crop?: boolean, defaultImg?: string): ThumbOptionsType;
function normalizeParams(crop?: boolean, defaultImg?: string): ThumbOptionsType;
function normalizeParams(...args: any[]) {
  if (!args.length) {
    return {};
  }
  if (typeof args[0] === 'object') {
    return args[0];
  }
  let size: string | number | SizeConfigType | undefined;
  let crop: boolean | undefined;

  if (typeof args[0] !== 'boolean') {
    size = args.shift() ?? 'small';
  }
  if (typeof args[0] === 'boolean') {
    crop = args.shift();
  }
  const defaultImg = args.shift();

  if (typeof size === 'string') {
    if (rStyle.test(size)) {
      return { style: size };
    }
    if (isSzSizeAlias(size)) {
      size = {
        width: alias[size],
        height: alias[size],
      };
    }
  }


  if (typeof size === 'number') {
    size = {
      width: size,
      height: size,
    };
  }

  if (typeof size !== 'object') {
    throw new Error('Size is invalid');
  }

  if (size.width) {
    size.width = +size.width;
  }
  if (size.height) {
    size.height = +size.height;
  }
  let mode = 'fit';
  if (crop) {
    mode = 'cover';
  }
  return {
    default: defaultImg,
    ...size,
    mode,
  };
}

/**
 *
 * @param input 图片url
 * @param args 配置项
 */
export default function thumb(input = '', ...args: Parameters<typeof normalizeParams>) {
  const options = { ...defaultOptions, ...normalizeParams(...args) };

  if (!input) {
    return options.default;
  }

  // 非OSS、非管道
  if (!isOssUrl(input) && !isDataPipeUrl(input)) {
    return input;
  }
  // 返回根据配置处理后的url
  return ossThumb(input, options);
}
