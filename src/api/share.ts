/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/prefer-default-export */

import { MaterialListItem } from '@/models/Material';
import axios from '@/utils/axios';

export type shareOptions={key:string, label:string}[];
// 生成分享链接
export interface ShareLinkParams {
  validityType: 1 | 2 | 3 | 4,
  code?: string,
  subject: string,
  isAgain: 1 | 0,
  type: 1 | 2,
  catalogIds: string[],
  isSync: 1 | 0,
  shareObject:[],
  shareObjectOptions:shareOptions
}
export const createShareLink = async (params: ShareLinkParams) => {
  type Response = { code: string, shareId: string };
  const res = (await axios.post<Response>('/om-material/share/url', params));
  return res;
};

// 读取链接对应的分享类型
export const fetchShareConfig = async (id: string) => {
  type Response = Omit<ShareLinkParams, 'catalogIds'>;
  const res = (await axios.get<Response>('/om-material/share/info', { params: { id } }));
  return res;
};

// 校验分享密码
export const checkShareCode = async (params: { id: string, code: string }) => {
  const res = (await axios.post<boolean>('/om-material/share/code/check', params));
  return res;
};

// 获取分享链接的面料列表
export const fetchShareMaterialList = async (id: string) => {
  const res = (await axios.get<TableData<MaterialListItem>>('/om-material/share/relates', { params: { id } }));
  return res;
};
// 获取分享对象
export const getShareObj = async () => {
  const res = (await axios.get('/om-material/apply/cooperator')).data;
  return res;
};
