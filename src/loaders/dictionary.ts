/* eslint-disable import/prefer-default-export */
import axios from '@/utils/axios';
import { DictOption, DictItem } from '@/models/Dictionary';
import i18next from 'i18next';
import envs from '@/utils/envs';
import cacheable from '@4dst-saas/public-utils/dist/cacheable';
import delay from '@4dst-saas/public-utils/dist/delay';
import { getContextUser } from './context';


export type StsConfig = {
  bucket: string,
  endPoint: string,
  expiration: number,
  keyId: string,
  keySecret: string,
  token: string
};
export type StsParams = {
  region?: string,
  accessKeyId: string,
  accessKeySecret: string,
  securityToken: string,
  endPoint: string,
  expiration: number,
  bucket: string,
};
type AuthConfig = {
  cfgs: {
    defaultRegion: string
    region: string
    upCh: number
  },
  dataPipeList: {
    serviceId: string
    serviceUrl: string
    serviceType: number
    companyId: string
    // eslint-disable-next-line camelcase
    sup_file_type: string
    belongZone: string
    belongRegion: string
  }[],
  ossSTS: {
    [key: string]: StsConfig
  }
};


export async function getOSSAuth() {
  return (await axios.get<StsConfig>('/show/dictionary/getOSSAuth')).data;
}


export async function getStorageServiceConfig() {
  const user = await getContextUser();
  return (await axios.get<AuthConfig>(
    `//${envs.VUE_APP_API_DOMAIN}/metaData/storageService/getStorageServiceConfig?companyId=${user?.companyId}`,
  )).data;
}

type OssUrlConfig = {
  URL_PREFIX: string
};
export async function getOSSUrl() {
  return (await axios.get<OssUrlConfig>('/show/dictionary/getOSSUrl')).data;
}


let _pGetUrlPrefix: Promise<OssUrlConfig> | undefined;
export async function getUrlPrefix() {
  _pGetUrlPrefix = _pGetUrlPrefix ?? getOSSUrl();
  return (await _pGetUrlPrefix).URL_PREFIX;
}


function convertStsToUploaderSts(ossConfig: StsConfig, region?: string) {
  return {
    region,
    accessKeyId: ossConfig.keyId,
    accessKeySecret: ossConfig.keySecret,
    securityToken: ossConfig.token,
    endPoint: ossConfig.endPoint,
    expiration: +ossConfig.expiration,
    bucket: ossConfig.bucket,
  };
}


export const getAuthConfig = cacheable(async () => {
  const config = await getStorageServiceConfig();
  return {
    ...config,
    ossSTS: Object.fromEntries(Object.entries(config.ossSTS).map(([key, stsConfig]) => {
      return [key, convertStsToUploaderSts(stsConfig, key)];
    })),
  };
}, {
  // @ts-ignore
  cacheContext: globalThis,
  async expires() {
    await delay(60 * 1000);
  },
});

// 需要传入domain作为url, 例如 'order-meeting.oss-cn-shenzhen.aliyuncs.com'
export const getSts = cacheable(async () => {
  const ossConfig = await getOSSAuth();
  return convertStsToUploaderSts(ossConfig);
}, {
  // @ts-ignore
  cacheContext: globalThis,
  async expires(p) {
    await delay((await p).expiration);
  },
});

// @ts-ignore
export const getDir = cacheable(async () => {
  // console.log(getOSSUrl);
  return getOSSUrl();
}, {
  expires: Infinity,
  cacheContext: globalThis,
});


/**
 * 根据类型获取该字典数据
 * @param {String} type 类型
 */
export async function getDict(params: { type: string }) {
  return (await axios.get<DictItem[]>(
    '/bff-center/showCommon/getDictionaryTypeItem',
    {
      headers: { language: i18next.language },
      params: { typeCode: params.type },
    },
  )).data.map(item => {
    return {
      usName: item.label,
      name: item.label,
      value: item.itemValue,
    };
  }) as DictOption[];
}

/**
 * 根据类型获取该字典数据
 * @param {String} type 类型
 */
export const getDictByType = (_type: string | { type: string }) => {
  const type = typeof _type === 'object' ? _type.type : _type;
  return getDict({ type });
};

/**
 * 根据类型获取该字典数据，可通过headers带上language
 * @param {String} typeCode
 * @see http://yapi.4dshoetech.local/project/115/interface/api/6104
 */
export async function getDictionaryByTypeCode(typeCode: string, language: string) {
  return (await axios({
    method: 'get',
    url: '/bff-center/showCommon/getDictionaryTypeItem',
    headers: { language },
    params: { typeCode },
  })).data as DictItem[];
}

/**
 * 根据title获取属性值列表
 * @param {String} typeCode
 * @see http://yapi.4dshoetech.local/project/140/interface/api/7168
 */
export async function fetchAntaPropertyByCode(title: string) {
  return (await axios({
    method: 'get',
    url: '/anta-material/dynamics/property/value/title',
    params: { title },
  })).data;
}

/**
 * 根据id获取属性值label
 * @param {String} typeCode
 * @see http://yapi.4dshoetech.local/project/140/interface/api/7635
 */
export async function fetchAntaPropertyById(id: string) {
  return (await axios({
    method: 'get',
    url: '/anta-material/dynamics/property/value/id',
    params: { id },
  })).data;
}
