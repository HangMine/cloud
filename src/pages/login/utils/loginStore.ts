/* eslint-disable import/prefer-default-export */
import {
  reactive, toRefs, ref, markRaw,
} from 'vue';
import { AccountType } from '@/api/account';
import tokenUtils from '@/utils/token';
import history from '@/utils/history';
import qs from 'qs';
import { getContextUser, updateContextUser } from '@/loaders/context';
import router from '@/router';


export const accountType = ref<AccountType>();
export const loading = ref(false);
export const qrcodeScene = ref('');

export const mainComponent = ref({
  name: 'login' as 'login' | 'qr-code' | 'role' | 'register' | 'reset-password' | 'success',
  props: {} as Obj,
});

export const getAccountTypeRedirect = async () => {
  let user = getContextUser();
  if (!user) {
    await updateContextUser();
    user = getContextUser();
    if (!user) throw new Error('用户信息获取失败');
  }
  const accountTypeRedirect = '/main/home';
  return accountTypeRedirect;
};

const getUrlRedirect = async () => {
  const urlRedirectObj = qs.parse(window.location.search.match(/^\?(.*)/)?.[1] || '');
  let urlRedirect = (urlRedirectObj.redirect || '') as string;
  // 处理不能识别的路由,包括'/'
  const isUnkownRedirect = router.getRoutes().every(route => {
    return !urlRedirect.includes(route.path);
  });
  if (isUnkownRedirect) {
    urlRedirect = await getAccountTypeRedirect();
  }
  return urlRedirect;
};


export const getHomeRedirect = async () => {
  const accountTypeRedirect = await getAccountTypeRedirect();
  const urlRedirect = await getUrlRedirect();
  const redirect = urlRedirect || accountTypeRedirect;
  console.log(redirect);
  return redirect;
};

export const handleLogined = async (token: string) => {
  tokenUtils.set(token);
  const redirect = await getHomeRedirect();
  const parsedHistory = history.parse(redirect);
  history.replace(parsedHistory);
  accountType.value = undefined;
  qrcodeScene.value = '';
};
