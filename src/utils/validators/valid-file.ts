import i18n from '@/i18n';
import splitUnit from '_/split-unit';
import { FileLike } from '_/is-file-like';
import getExt, { getFileName } from '_/get-ext';
import {
  allowMap, getFileValidationOptions, TypeValidationOption, TypeValidationOptionWithType,
} from '../get-file-validation-options';

type ItemOrArray<T> = T | T[];
type Url = string;
export function validFile(file: FileLike | Url,
  options: ItemOrArray<TypeValidationOption | TypeValidationOptionWithType | string> = Object.keys(allowMap)) {
  const allows = getFileValidationOptions(options);
  const ext = getExt(file).toLowerCase();
  const fileName = typeof file === 'object' ? file.name : getFileName(file);
  if (ext) {
    if (!allows.extensions.some((extension) => extension === ext)) {
      const fileTypeError = new Error(i18n.t('file-list.file_type_invalid', {
        file,
        fileName,
        allows,
      }));
      // @ts-ignore
      fileTypeError.isFileTypeError = true;// 方便外部区分error类型
      throw fileTypeError;
    }
  } else if (typeof file === 'object' && file.type && !allows.mimeTypes.some((extension) => extension === file.type)) {
    throw new Error(`上传文件 ${fileName} 不符合格式! \n仅支持如下格式：\n ${allows.title.join('\n')})!`);
  }
  if (ext && typeof file === 'object' && file.size) {
    const sizeLimit = allows.extSizeLimit ? allows.extSizeLimit[ext] : allows.sizeLimit;
    const [sizeLimitNum, sizeUnit] = splitUnit(sizeLimit);
    if (file.size > sizeLimit) {
      throw new Error(`文件 "${fileName}" 的大小不能超过 ${sizeLimitNum.toFixed(2)}${sizeUnit}B`);
    }
  }
}
export function validFiles(
  files: (FileLike | Url)[],
  options: ItemOrArray<TypeValidationOption | TypeValidationOptionWithType | string> = Object.keys(allowMap),
) {
  console.info(files);
  files.forEach((file) => {
    validFile(file, options);
  });
}
export default validFile;
