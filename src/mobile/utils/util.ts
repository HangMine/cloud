import qs from 'query-string';
import tokenUtils from '@/utils/token';
import { ElMessage } from 'element-plus';

export const isMini = () => {
  return window.navigator.userAgent.includes('miniProgram');
};

export const getMiniToken = () => {
  const { query } = qs.parseUrl(window.location.href);
  const { MINI_TOKEN } = query;
  if (!MINI_TOKEN) {
    ElMessage.error('获取不到token');
  }
  return MINI_TOKEN as string;
};

export const miniInit = () => {
  // if (isMini()) {
  const miniToken = getMiniToken();
  tokenUtils.set(miniToken);
  document.title = '3D渲染';
  // }
};

export const getCatalogIdFromURL = () => {
  const { query } = qs.parseUrl(window.location.href);
  console.log('query', query);
  const { catalogId } = query;
  return catalogId;
};
