import { OSSUploader } from '@/utils/oss/uploader';
import isDataUrl from '_/is-data-url';
import { dataUrl2Blob } from '_/blob-utils';

/**
 *
 * @param {Blob|string} blobOrDataUrl 一个dataUrl或者Blob对象（包括File）
 * @param {string} [sourceType] 资源类型 - @see {@link http://api.4dshoetech.com/project/61/interface/api/4387}
 * @param {(event: unknown,
    fileLoaded: number,
    fileSize: number,
    process: number,
    options: ComputedUploaderOptions<Params, Query>
  ) => any} [onUpload] 上传进度 - 具体自己看结果或者源码
 * @return {Promise<string>}
 */
const uploadToOSS = async (blobOrDataUrl, sourceType, onUpload) => {
  let body;
  if (typeof blobOrDataUrl === 'string' && isDataUrl(blobOrDataUrl)) {
    // 转化blob对象
    body = dataUrl2Blob(blobOrDataUrl);
  } else {
    body = blobOrDataUrl;
  }
  // OSSUploader 会自动处理后缀名的问题，不需要额外的处理
  // 上传到oss
  /** @see {@link vscode://../from/a} */
  const { key } = await OSSUploader.send({
    fileId: Symbol('uploadFile'),
    sourceType,
    body,
    onUpload,
  });
  return key;
};

export default uploadToOSS;
