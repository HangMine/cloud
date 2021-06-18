import qs from 'query-string';
import { getAuthConfig, getSts, StsParams } from '@/loaders/dictionary';
import { ab2base64, hmac, utf82u8a } from '@4dst-saas/public-utils/dist/blob-utils';
import first from '@4dst-saas/public-utils/dist/first';
import own from '@/utils/own';

type QueryValue = string | string[] | null | undefined;
type Query = { [x: string]: QueryValue };
type Params = StsParams & {
  key: string,
} & {
  [other: string]: any
};
type Method =
  'get' | 'post' | 'put' | 'delete' | 'patch' | 'head'
  | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
type Headers = {
  [x: string]: string
};
export function qsStringifyForSign(query: Query) {
  return Object.keys(query).sort((a, b) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }).map((k) => {
    let value;
    const _v = query[k];
    if (_v === undefined) {
      value = '';
    } else if (_v === null) {
      value = '=null';
    } else {
      value = `=${_v.toString()}`;
    }
    return `${k}${value}`;
  }).join('&');
}

export async function getSignature({
  params, method, headers, query, debug,
}: { params: Params, method: Method, headers: Headers, query: Query, debug?: boolean }) {
  const dateOrExpires = headers.Date ?? headers['x-oss-date'] ?? query.Expires;
  const ossHeaderReg = /^x-oss-/;
  const ignoreQuery = ['Expires', 'OSSAccessKeyId', 'rg', 'ch'];
  const ossHeaderKeys = Object.keys(headers).filter(key => ossHeaderReg.test(key)).sort();
  const ossQuery = Object.fromEntries(Object.entries(query)
    .filter(([key]) => !ignoreQuery.includes(key))
    .map(t => t));
  const ossQueryString = qsStringifyForSign(ossQuery);
  const data = [
    method.toUpperCase(),
    headers['Content-Md5'] || '',
    headers['Content-Type'] || '',
    dateOrExpires,
    ...ossHeaderKeys.map((key) => {
      return `${key}:${headers[key].trim()}`;
    }),
    `/${params.bucket}/${params.key}${ossQueryString ? `?${ossQueryString}` : ''}`,
  ].join('\n');
  const result = ab2base64(await hmac('SHA-1', params.accessKeySecret, utf82u8a(data)));
  if (debug) {
    console.groupCollapsed('生成OSS签名信息 %s 签名内容如下', result);
    console.info(data);
    console.group('URL为');
    const _queryString = qs.stringify({ ...query, Signature: result });
    console.info(`https://${params.bucket}.${params.endPoint}/${params.key}?${_queryString || ''}`);
    console.groupEnd();
    console.groupEnd();
  }
  return result;
}


const stsDomain2Config = {
  'bucket.us-east-cdn.4dshoetech.com': {
    bucket: 'sdtc-usa',
    endPoint: 'oss-us-east-1.aliyuncs.com',
  },
  'bucket.us-east-uat-cdn.4dshoetech.com': {
    bucket: 'sdtc-usa-uat',
    endPoint: 'oss-us-east-1.aliyuncs.com',
  },
  'bucket.cn-shenzhen-cdn.4dshoetech.com': {
    bucket: 'sdtc-show',
    endPoint: 'oss-cn-shenzhen.aliyuncs.com',
  },
  'bucket.uat-cn-shenzhen-cdn.4dshoetech.com': {
    bucket: 'sdtc-uat',
    endPoint: 'oss-cn-shenzhen.aliyuncs.com',
  },
};
export async function signUrl(url: string) {
  let query: qs.ParsedQuery = {};
  let rg: null | string = null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let ch: null | string = null;
  const tmp = url.split('?');
  ([url] = tmp);
  const queryString = tmp[1];
  if (queryString) {
    query = qs.parse(queryString);
  }
  let rgArr: QueryValue;
  let chArr: QueryValue;
  ({ rg: rgArr, ch: chArr, ...query } = query);
  rg = first(rgArr);
  ch = first(chArr);
  let protocal = 'https://';
  url = url.replace(/^https?:\/\//, (p) => {
    protocal = p;
    return '';
  });
  protocal = protocal.replace('://', '');
  const urlArr = url.split('/');
  let domain = urlArr.shift();

  const key = urlArr.join('/');
  let domainConfig = null;
  let stsData;
  if (rg) {
    const authConfig = await getAuthConfig();
    stsData = authConfig.ossSTS[rg] ?? authConfig.ossSTS[authConfig.cfgs.defaultRegion];
  } else {
    if (domain) {
      if (own(stsDomain2Config, domain)) {
        domainConfig = stsDomain2Config[domain];
      } else if (domain.endsWith('.aliyuncs.com')) {
        const domainArr = domain.split('.');
        domainConfig = {
          bucket: domainArr.shift(),
          endPoint: domainArr.join('.'),
        };
      }
    }
    stsData = { ...await getSts(), ...domainConfig };
    const { bucket, endPoint } = stsData;
    domain = `${bucket}.${endPoint}`;
  }

  delete query.Signature;

  query = {
    ...query,
    'security-token': stsData.securityToken,
    OSSAccessKeyId: stsData.accessKeyId,
    Expires: `${Math.floor(Date.now() / 1000) + 60 * 15}`,
  };
  const signature = await getSignature({
    query,
    method: 'GET',
    headers: {},
    params: {
      ...stsData,
      key,
    },
  });
  const _queryString = qs.stringify({ ...query, Signature: signature });
  return `${protocal}://${domain}/${key}?${_queryString || ''}`;
}

export default signUrl;
