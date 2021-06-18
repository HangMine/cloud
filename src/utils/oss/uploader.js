
import ChunkedUploader from '_/chunk-uploader';
import { getAuthConfig, getDir } from '@/loaders/dictionary';
import { getContextUser } from '@/loaders/context';
import getExt from '@4dst-saas/public-utils/dist/get-ext';
import {
  blob2Ab, blobSlice, md5, getSts,
} from '@4dst-saas/public-utils/dist/blob-utils';
import axios from '../axios';
import envs from '../envs';
import { getSignature, qsStringifyForSign } from './utils/sign';

export async function getOssAuth(config) {
  const { params, debug } = config;
  const signature = await getSignature(config);
  const result = `OSS ${params.accessKeyId}:${signature}`;
  if (debug) {
    console.log('OSS HEAD签名为 %s', result);
  }
  return result;
}

// const where = (arr, ...args) => Array.prototype.findIndex.call(arr, ...args);

// export function getUploadObject(xml, key) {
//   const e = where(xml.querySelectorAll('Upload'), (item) => {
//     return item.querySelector('Key').innerHTML === key;
//   });
//   return e ? {
//     key: e.querySelector('Key').innerHTML,
//     uploadId: e.querySelector('UploadId').innerHTML,
//     storageClass: e.querySelector('StorageClass').innerHTML,
//     initiated: e.querySelector('Initiated').innerHTML,
//   } : undefined;
// }


// async function getUploadId(key) {
//   let uploadId
//   const uploadObject = getUploadObject(await OSSRequest.send({
//     method: 'GET',
//     sts: this.sts,
//     params: {
//       key: ''
//     },
//     query: {
//       prefix: key,
//       uploads: undefined
//     }
//   }), key);
//   if (uploadObject) {
//     uploadId = uploadObject.uploadId
//   }
//   return uploadId
// }


export function xml2Remains(xml, file, chunkSize) {
  const nextChunk = +xml.querySelector('NextPartNumberMarker').innerHTML;
  const start = nextChunk * chunkSize;
  const end = file.size;
  return end > start ? [{
    start,
    end,
  }] : [];
}

// 返回一个文件唯一名字
export async function hashName(file) {
  const chunkLength = 1024 * 1024;
  const chunkSize = Math.ceil(file.size / chunkLength);
  const names = [chunkSize, md5(await blob2Ab(blobSlice(file, {
    start: 0,
    end: chunkLength,
  })))];
  if (chunkSize >= 3) {
    const endIndex = Math.ceil(chunkSize / 2);
    names.push(md5(await blob2Ab(blobSlice(file, {
      start: (endIndex - 1) * chunkLength,
      end: endIndex * chunkLength,
    }))));
  }
  if (chunkSize >= 2) {
    names.push(md5(await blob2Ab(blobSlice(file, {
      start: (chunkSize - 1) * chunkLength,
      end: chunkSize * chunkLength,
    }))));
  }
  return md5(names.join('-'));
}

export async function getParams(file, {
  encrypt, compress, sourceType = 'BASE', basePath,
} = { sourceType: 'BASE' }) {
  const authConfig = await getAuthConfig();
  const stsData = authConfig.ossSTS[authConfig.cfgs.region] ?? authConfig.ossSTS[authConfig.cfgs.defaultRegion] ?? await getSts();
  // 获取文件key
  const { id: userId, companyId } = getContextUser() ?? { id: '', companyId: '' };
  const encryptName = encrypt ? `.${md5(JSON.stringify(encrypt))}.ljf` : '';
  const compressName = compress ? `-${md5(JSON.stringify(compress))}` : '';
  basePath = basePath ?? (await getDir())[sourceType];
  const ext = getExt(file).toLowerCase();
  const path = `${await hashName(file)}${compressName}${ext ? `.${ext}` : ''}${encryptName}`;
  const key = `${basePath}${path}`.replace(/^\//, '');

  // const compressName = '';
  return {
    ...stsData,
    userId,
    companyId,
    key,
    path,
    basePath,
  };
}

export const uploadIdCache = {
  KEY: 'oss-upload-ids',
  update(map) {
    global.localStorage.setItem(this.KEY, JSON.stringify(map));
  },
  getMap() {
    let map = global.localStorage.getItem(this.KEY);
    if (map) {
      map = JSON.parse(map);
    } else {
      map = {};
    }
    return map;
  },
  get(key) {
    const map = this.getMap();
    return map[key];
  },
  remove(key) {
    const map = this.getMap();
    delete map[key];
    this.update(map);
  },
  set(key, value) {
    const map = this.getMap();
    map[key] = value;
    this.update(map);
  },
};

const protocol = /^(http|https):/;


const reduce = (arr, ...args) => Array.prototype.reduce.call(arr, ...args);

/*
  const file = {
    url: undefined,
    value: undefined,
    thumb: Url.createUrl(..),
  }

  img.push(file);
  const uploader = new OSSUploader()
  const data = await uploader.send({
    body: e.target.files[0],
    onUpload(_, loaded, size, progress, options) {
      console.log(parseInt(progress * 100))
    }
  })
  file.url = data.url;
  file.key = data.key;

*/

export class OSSUploader extends ChunkedUploader {
  static defaults = {
    // debug: true,
    ...ChunkedUploader.defaults,
    method: 'PUT',
    sendAs: 'arrayBuffer',
    url(params) {
      return `${protocol.test(global.location.protocol) ? global.location.protocol : 'http'}//${params.bucket}.${params.endPoint}/${params.key}`;
    },
    sourceType: 'BASE',
    queryStringify: qsStringifyForSign,
    async getParams(file, options) {
      return getParams(file, options);
    },
  };

  async done(options) {
    const isChunk = options.chunked;
    let xhr;
    if (isChunk) {
      const { key } = options.params;
      const parts = (await this.transport({
        queryStringify: options.queryStringify,
        url: options.url,
        method: 'GET',
        type: 'document',
        params: options.params,
        query: options.query,
        headers: {},
      })).data.querySelectorAll('Part');

      const xml = `${reduce(parts, (memo, part) => {
        // eslint-disable-next-line max-len
        return `${memo}<Part><PartNumber>${part.querySelector('PartNumber').innerHTML}</PartNumber><ETag>${part.querySelector('ETag').innerHTML}</ETag></Part>`;
      }, '<?xml version="1.0" encoding="UTF-8"?>\n<CompleteMultipartUpload>\n')}\n</CompleteMultipartUpload>`;
      xhr = await this.transport({
        queryStringify: options.queryStringify,
        url: options.url,
        type: 'document',
        method: 'POST',
        body: xml,
        params: options.params,
        query: options.query,
        headers: {
          'Content-Type': 'text/xml',
        },
      });
      uploadIdCache.remove(key);
    }

    try {
      await axios.post(`//${envs.VUE_APP_API_DOMAIN}/metaData/storageService/saveMetaData`, [{
        relativePath: options.params.key,
        fullRegion: options.params.region,
        resourceCompanyId: options.params.companyId,
      }]);
    } catch (err) {
      // TODO: 以后全面替换后，去掉这部分逻辑
      if (err.code !== 404) {
        throw err;
      }
    }
    return xhr;
  }

  async getRemains(options) {
    const xml = (await this.transport({
      queryStringify: options.queryStringify,
      type: 'document',
      url: options.url,
      params: options.params,
      method: 'GET',
      query: {
        uploadId: options.query.uploadId,
      },
    })).data;
    return xml2Remains(xml, options.body, options.chunked.size);
  }

  async getUploadId(options) {
    const { key } = options.params;
    let uploadId = uploadIdCache.get(key);
    if (!uploadId) {
      const document = (await this.transport({
        queryStringify: options.queryStringify,
        type: 'document',
        url: options.url,
        method: 'POST',
        headers: {
          'Content-Type': options.body.type ?? '',
        },
        data: '这里的data只是为了避免axios不提交content-type',
        params: options.params,
        query: {
          uploads: undefined,
        },
      })).data;
      uploadId = document.querySelector('UploadId').innerHTML;
      uploadIdCache.set(key, uploadId);
    }

    return uploadId;
  }

  async transport(options, callbackOptions) {
    options.headers = { ...(options.headers || {}) };
    options.headers['x-oss-date'] = (new Date())
      .toGMTString()
      .replace(/\d+/, ($0) => ($0.length === 1 ? `0${$0}` : $0)).replace('UTC', 'GMT');
    options.headers['x-oss-security-token'] = options.params.securityToken;
    options.headers.authorization = await getOssAuth(options);
    return super.transport(options, callbackOptions);
  }

  async prepare(options) {
    options = { ...options };

    options = await super.prepare(options);

    if (options.chunked && !('uploadId' in options.query)) {
      options.query = { uploadId: await this.getUploadId(options), ...(options.query || {}) };
    }
    return options;
  }

  static send(...args) {
    this.singleton = this.singleton || new OSSUploader();
    return this.singleton.send(...args);
  }
}


export default OSSUploader;
