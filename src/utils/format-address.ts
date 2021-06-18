import * as api from '@/api/account';

enum requestMapping {
  'fetchCountryList',
  'fetchProvinceList',
  'fetchCityList',
}

let cacheAddress = {};
const STORAGE_KEY = 'CACHE_ADDRESS';
const testList = ['49', '19', '202'];

/**
 *
 * @desc 构建地址树
 * @param {array} idList 地址id数组,格式为[countryId, provinceId, cityId]
 */
const requestAddressTree = async (idList) => {
  const storageAddress = localStorage.getItem(STORAGE_KEY);
  storageAddress && (cacheAddress = JSON.parse(storageAddress));

  let currentSet;
  let params;
  let currentId;
  let request;
  let res;

  for (let i = 0; i < idList.length; i++) {
    currentSet = i === 0 ? cacheAddress : currentSet[currentId]?.children;
    params = i === 0 ? {} : { parentIds: [currentId] };
    currentId = idList[i];
    if (!currentId) {
      break;
    }
    if (!currentSet[currentId]) {
      request = api[requestMapping[i]];
      res = await request(params);
      // eslint-disable-next-line no-loop-func
      res.forEach(item => {
        currentSet[item.id] = {
          name: item.fullZhName,
          children: {},
          id: item.id,
        };
      });
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheAddress));
};

/**
 *
 * @desc 根据地址Id数组获取地址项数组
 * @param {array} idList 地址id数组,格式为[countryId, provinceId, cityId]
 * @return {array} [国项, 省项, 市项]
 */
const getMatchedAddressList = async (idList) => {
  if (!idList) {
    return [];
  }
  await requestAddressTree(idList);
  let currentSet = cacheAddress;
  return idList.reduce((pre, nxt) => {
    if (!nxt) return pre;
    const currentItem = currentSet[nxt];
    if (!currentItem) return pre;
    currentSet = currentItem.children;
    return [...pre, currentItem];
  }, []);
};

/**
 *
 * @desc 根据地址Id数组获取中文
 * @param {array} idList 地址id数组,格式为[countryId, provinceId, cityId]
 * @return {string} xx国xx省xx市
 */
const getMatchedAddressCnText = async (idList) => {
  if (!idList) {
    return '';
  }
  await requestAddressTree(idList);
  let currentSet = cacheAddress;
  return idList.reduce((pre, nxt) => {
    if (!nxt) return pre;
    const currentItem = currentSet[nxt];
    if (!currentItem) return pre;
    currentSet = currentItem.children;
    return pre + currentItem.name;
  }, '');
};

export default getMatchedAddressCnText;

export {
  getMatchedAddressList,
  getMatchedAddressCnText,
};
