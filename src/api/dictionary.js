import { getDictByType as _getDictByType } from '@/loaders/dictionary';
import axios from '@/utils/axios';

/**
 * 根据类型获取该字典数据
 * @param {String} type 类型
 * @returns {Promise}
 */
export const getDictByType = async (type) => {
  return {
    data: await _getDictByType({ type }),
  };
};

/**
 * 根据类型获取该字典数据
 * @param {String} typeCode
 * @see http://yapi.4dshoetech.local/project/115/interface/api/6104
 */
export const getDictionaryByTypeCode = (typeCode) => {
  return axios({
    method: 'get',
    url: '/bff-center/showCommon/getDictionaryTypeItem',
    // headers: { language },
    params: { typeCode },
  });
};

/**
 * 获取国家列表
 * @param {String} keyword 搜索关键字
 * @returns {Promise}
 */
export const getCountryList = (keyword = '') => {
  return axios({
    method: 'get',
    url: '/show/dictionary/getCountry',
    params: { keyword },
  });
};

/**
 * 获取国家列表
 * @param {String} countryId 国家ID
 * @param {String} keyword 搜索关键字
 * @returns {Promise}
 */
export const getCityList = (countryId, keyword = '') => {
  return axios({
    method: 'get',
    url: '/show/dictionary/getCity',
    params: { countryId, keyword },
  });
};


export const getOSSAuth = () => {
  return axios({
    method: 'get',
    url: '/show/dictionary/getOSSAuth',
  });
};

export const getOSSUrl = () => {
  return axios({
    method: 'get',
    url: '/show/dictionary/getOSSUrl',
  });
};

// 获取国家下的城市


/* ==================== 标签相关 ================== */
/**
 * 新增标签
 * @param {Object} data { shareId: string, tags: string[], type: string }
 * @see http://yapi.4dshoetech.local/project/115/interface/api/6116
 */
export const addTags = (data) => {
  return axios({
    method: 'post',
    url: '/bff-center/showCommon/addTags',
    data,
  });
};

/**
 * 删除标签
 * @param {Array} tagIds { string[] }
 * @see http://yapi.4dshoetech.local/project/115/interface/api/6128
 */
export const removeTags = (tagIds) => {
  return axios({
    method: 'post',
    url: '/bff-center/showCommon/deleteTag',
    data: tagIds,
  });
};
