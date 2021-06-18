import { ThumbOptions as _ThumbOptions } from '@/typings/thumb-options.d';

export type OssValue = string | number | undefined;
export type OssProcessParamsMap = {[pramsKey: string]: OssValue };
export type OssProcessCommandsMap = {[command?: string]: OssProcessParamsMap | OssValue};
export type OssProcess = {[module?: string]: OssProcessCommandsMap | OssValue };
export type OssParsedResult = {url: string, process: OssProcess};
export type ThumbOptions = _ThumbOptions & {
  style?: string
};
