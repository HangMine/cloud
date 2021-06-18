
import own from '@/utils/own';
import generateOssResizeProcess from './generate-oss-resize-process';
import { stringifyUrl } from './process';
import { ThumbOptions } from './typings';

const rQuery = /\?.*$/;
const mode2commands = {
  fit: '0c',
  cover: '1c_1e',
};

function thumbByOldVersion(input = '', options: ThumbOptions) {
  if (options.maxRatio && options.maxRatio !== 1) {
    throw new Error('maxRatio only suport 1');
  }
  // 修正域名，img-cn域名才可以接受缩略图参数
  input = input.replace('oss-cn', 'img-cn');
  let query = '';
  input = input.replace(rQuery, (_) => { query = _; return ''; });

  const commands = [];
  if (options.width) {
    commands.push(`${Math.round(options.width)}w`);
  }
  if (options.height) {
    commands.push(`${Math.round(options.height)}h`);
  }

  if (options.maxRatio) {
    commands.push('1l');
  }

  const { mode } = options;

  if (mode && mode !== 'fit') {
    if (own(mode2commands, mode)) {
      commands.push(mode2commands[mode]);
    } else {
      throw new Error(`do not support mode ${options.mode}`);
    }
  }


  return `${input}${input.indexOf('@') === -1 ? '@' : '|'}${commands.join('_')}${query}`;
}


export function thumb(url: string, options: ThumbOptions) {
  if (url.indexOf('@') !== -1) {
    return thumbByOldVersion(url, options);
  }
  const process = generateOssResizeProcess(options);
  return stringifyUrl({ url, process });
}

export default thumb;
