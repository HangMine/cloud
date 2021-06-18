/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/prefer-default-export */
import Material, { MaterialDetail, MaterialListItem } from '@/models/Material';
import axios from '@/utils/axios';
import envs from '@/utils/envs';
import originAxios from 'axios';

interface CategoryItem {
  id: string,
  name: string,
  level: number,
  hasChild?: boolean
}

interface ParentCategoryItem extends CategoryItem {
  pid: string,
  pname: string,
  plevel: number
}

export type Category = CategoryItem[];
type ParentCategory = ParentCategoryItem[];

// 获取子类目(第一层传'-1')
export const fetchChildCategory = async (params: { pId: string }) => {
  const res = await axios.get<Category>('/mp-material/category/child/node', { params });
  return res;
};

// 获取父类目
// export const fetchParentCategory = async (id: string) => {
//   const res = await axios.get<CatergoryItem>('/mp-material/category/parent', { params: { id } });
//   return res;
// };

// 获取类目(包含父类目信息)
export const fetchCategory = async (id: string) => {
  const res = await axios.get<ParentCategoryItem>('/mp-material/category/parent', { params: { id } });
  return res;
};

// 获取最下级获取整个类目
export const fetchCategoryList = async (id: string) => {
  const currentCategory = (await fetchCategory(id)).data;
  const parentCategory: ParentCategory = [currentCategory];

  const loop = async (parentId: string) => {
    const { data: parentCategoryItem } = await fetchCategory(parentId);
    if (parentCategoryItem) {
      parentCategory.unshift(parentCategoryItem);
      await loop(parentCategoryItem.pid);
    }
  };
  await loop(currentCategory.pid);
  const caterogryList: Category = [];
  parentCategory.forEach((item, i) => {
    const categoryItem = {
      id: item.id,
      name: item.name,
      level: item.level,
    };
    if (i === 0) {
      const parentCategoryItem = {
        id: item.pid,
        name: item.pname,
        level: item.plevel,
      };
      caterogryList.push(parentCategoryItem);
    }
    caterogryList.push(categoryItem);
  });

  return caterogryList;
};

// 上传面料
export const uploadMaterial = async (params: Material & { hasFile: 1 | 0 }) => {
  const res = await axios.post<string>('/om-material/material/upload', params);
  return res;
};

// 面料详情
export const fetchMaterial = async (catalogId: string) => {
  const res = await axios.get<MaterialDetail>('/om-material/material/detail', { params: { catalogId } });
  return res;
};

// 历史面料详情
export const fetchHistoryMaterial = async (relateId: string) => {
  const res = await axios.get<MaterialDetail>('/om-material/material/history/info', { params: { relateId } });
  return res;
};

// 编辑面料
export const editMaterial = async (params: Material & { catalogId: string, hasFile: 1 | 0 }) => {
  const res = await axios.post<string>('/om-material/material/update', params);
  return res;
};

// 删除面料
export const delMaterial = async (catalogIds: string[]) => {
  const res = await axios.post<null>('/om-material/material/delete', catalogIds);
  return res;
};

export interface MaterialSearchFields {
  categoryId: string[],
  tag: string,
  season: string[],
  year: string[],
  applicableProduct: string[],
  colorFamily: string[],
  isInStock: string,
  sampleMoq: string[],
  sampleMoqUnit: string,
  moq: string[],
  moqUnit: string,
  price: string[],
  priceCurrency: string,
  leadTime: string[],
  leadTimeUnit: string,
  grammage: string[],
  grammageUnit: string,
  thickness: string[],
  thicknessUnit: string,
  width: string[],
  widthUnit: string,
  textureType: string,
  modeOfProduction: string,
  organizationType: string,
  orgId: string,
}

export type MaterialSortType = 1 | 2 | 3; // 浏览量/收藏量/分享量
export type MaterialSort = 1 | 2; // 正序/倒序
export type NormalMaterialListSearchParams = Partial<{ keywords: string, fields: Partial<MaterialSearchFields>, sortType: MaterialSortType, sort: MaterialSort, page: number, size: number }>;

export const fetchMaterialList = async (params: NormalMaterialListSearchParams) => {
  const res = (await axios.post<TableData<MaterialListItem>>('/om-material/material/search', params)).data;
  return res;
};

// 公开市场列表
export const fetchMarketMaterialList = async (params: NormalMaterialListSearchParams) => {
  const res = (await axios.post<TableData<MaterialListItem>>('/om-material/open/market/search', params)).data;
  return res;
};

// 上架市场
export const onMarket = async (catalogIds: string[]) => {
  const res = (await axios.post<null>('/om-material/open/market/on', catalogIds)).data;
  return res;
};

// 下架市场
export const downMarket = async (catalogIds: string[]) => {
  const res = (await axios.post<null>('/om-material/open/market/off', catalogIds)).data;
  return res;
};

// 收藏列表(他人分享)
export const fetchCollectList = async (params: NormalMaterialListSearchParams) => {
  const res = (await axios.post<TableData<Material>>('/om-material/collect/search', params)).data;
  return res;
};

// 收藏(他人分享)
export const collectMaterial = async (catalogIds: string[]) => {
  const res = (await axios.post<null>('/om-material/collect/add', catalogIds)).data;
  return res;
};

// 取消收藏(他人分享)
export const cancelCollectMaterial = async (catalogIds: string[]) => {
  const res = (await axios.post<null>('/om-material/collect/remove', catalogIds)).data;
  return res;
};

// 收藏列表(公开市场)
// export const fetchCollectFromOmList = async (params: NormalMaterialListSearchParams) => {
//   const res = (await axios.post<TableData<Material>>('/om-material/collect/om/search', params)).data;
//   return res;
// };

// // 收藏(公开市场)
// export const collectMaterialFromOm = async (catalogIds: string[]) => {
//   const res = (await axios.post<null>('/om-material/collect/om/add', catalogIds)).data;
//   return res;
// };

// // 取消收藏(公开市场)
// export const cancelCollectMaterialFromOm = async (catalogIds: string[]) => {
//   const res = (await axios.post<null>('/om-material/collect/om/remove', catalogIds)).data;
//   return res;
// };

// 历史版本
export interface HistoryVersion {
  relateId: string,
  isOm: string,
  gmtCreateTime: number,
  vCode: number,
  versionName: string,
  note: { [key: string]: 'UPDATE' | 'INSERT' | 'DELETE' }
}
export const fetchVersionList = async (catalogId: string) => {
  type Response = HistoryVersion[];
  const res = await axios.get<Response>('/om-material/material/history/version', { params: { catalogId } });
  return res;
};


export const resetVersion = async (params: {
  relateId: string,
  catalogId: string,
  isSync: boolean
}) => {
  const res = (await axios.post<string>('/om-material/material/history/revert', params));
  return res;
};

// 公模+部位列表
export type Part = {
  code: string,
  name: string,
  itemCode?: Part[]
};
export type ModelApiItem = {
  id: string,
  name: string,
  modelProp: {
    id: string,
    name: string,
    img: string,
    partProp?: Part[]
  }[]
};
export const fetchPublicModelList = async () => {
  const envMap = {
    development: 'dev',
    sit: 'sit',
    staging: 'sit',
    uat: 'uat',
    production: 'production',
  };
  const res = await originAxios.get<ModelApiItem[]>(`https://sdtc-public-picture.4dshoetech.com/material-library/config/${envMap[envs.VUE_APP_MODE]}/model_config.json`);
  return res;
};

export const parse4ddat = async ({
  sddatName, sddatFile, rg, companyId,
}: { sddatName: string, sddatFile: File, rg: string, companyId: string }) => {
  type Response = {
    '4DDATPath': string,
    imgInfo: {
      'uploads_COLOR.PNG': string,
      'uploads_GLOSS.PNG': string,
      'uploads_NORMAL.PNG': string,
      'uploads_SPECULAR.PNG': string,
    },
    renderingInfo: string
  };
  const formData = new FormData();
  formData.append('file', sddatFile);
  const res = (await originAxios.post<Response>(`/datapipe/parser/${sddatName}`, formData, {
    baseURL: `//${envs.VUE_APP_API_DOMAIN}/`,
    headers: {
      'content-type': 'multipart/form-data',
    },
    params: {
      rg, companyId,
    },
  })).data;
  return res;
};

// // 公模部位列表
// export type PartApiItem = {
//   id: string,
//   modelId: string,
//   name: string,
//   partCode: string,
// };
// export const fetchPartsList = async (params: { page: number, size: number, modelId?: string }) => {
//   const res = await axios.get<TableData<PartApiItem>>('om-material/MaterialPartsConfig/listPage', { params });
//   return res;
// };


/**
 *   获取小程序码
 *   调用方法:
 *       const res = await getMiniProgramQrCodeData('pages/login/index', '123456abc', 300);
 *       console.log(res); //res 是一个base64的图片数据
 *
 *   page获取二维码中的自定义数据
 *   1. 使用小程序内的扫描接口扫描(此函数返回的小程序二维码)
 *      组件内定义名为qrcodeScene的props, 类型为string, 内容对应getMiniProgramQrCodeData函数的scene参数
 *      32个字符的字符串
 *
 *   2. 使用微信的扫一扫功能扫描(此函数返回的小程序二维码)
 *      在组件的export default里， setup()的同级位置，实现onLoad
 *      onLoad(query) {
 *         console.log(query.scene); //内容对应getMiniProgramQrCodeData函数的scene参数
 *       },
 */

// eslint-disable-next-line camelcase
export const getMiniProgramQrCodeData = async (page: string, scene: string, width: number, is_hyaline = false): Promise<string> => {
  width = width || 200;
  scene = scene || '';
  // eslint-disable-next-line camelcase
  const res = (await axios.post('/om-material/wechat/qrcode', {
    page, scene, width, is_hyaline,
  })).data;
  return res.qrcode;
};
