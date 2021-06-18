import {
  createRouter, createWebHistory, RouteLocationNormalized, RouteRecordNormalized, RouteRecordRaw,
} from 'vue-router';
import isNeedLogin from '@/router/utils/is-need-login';
import isNeedValidLoginStatus from '@/router/utils/is-need-valid-login-status';
import tokenUtils from '@/utils/token';
import { getContextUser, updateContext } from '@/loaders/context';
import AppError from '@/utils/error';
import axios from '@/utils/axios';
import errHandler, { isAuthError, isNeedLoginError } from '@/utils/error-handler';
import { getHomeRedirect } from '@/pages/login/utils/loginStore';
import { generateAutoRoute } from '../public-utils/router/generate-auto-route';


const pages = generateAutoRoute({
  path: '',
  name: '',
  requireContext: require.context('@/pages', true, /\.(vue|[jt]sx?)$/, 'lazy'),
}) as RouteRecordRaw[];

const mobilePages = generateAutoRoute({
  path: '/mobile',
  name: '',
  requireContext: require.context('@/mobile/pages', true, /\.(vue|[jt]sx?)$/, 'lazy'),
}) as RouteRecordRaw[];


const routes: Array<RouteRecordRaw> = [
  ...pages,
  ...mobilePages,
];


const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { left: 0, top: 0 };
  },
});

const handleRootRoute = async () => {
  router.push(await getHomeRedirect());
};


let cacheToken: string | undefined;
router.beforeEach(async (to) => {
  // 校验登录
  if (!isNeedLogin(to)) {
    return;
  }

  const storageToken = tokenUtils.get();
  if (!storageToken && isNeedValidLoginStatus(to)) {
    return;
  }
  if (storageToken !== cacheToken) {
    // 处理'/'的根据角色重定向
    if (to.path === '/') {
      await handleRootRoute();
      return;
    }
    await updateContext();
    cacheToken = storageToken;
  }
  // if (isNeedValidLoginStatus(to)) {
  //   return;
  // }
  const user = getContextUser();
  if (!user) {
    throw AppError.needLogin; // vue-router4有捕获错误的功能
    // router.push('/login');
  }
});

const axiosUnbind = router.afterEach(async (to) => {
  axiosUnbind();
  axios.interceptors.response.use((a) => a, (err) => {
    setTimeout(() => {
      // 让其他handler优先处理
      errHandler(err, isAuthError(err) && isNeedLogin(router.currentRoute));
    }, 0);
    return Promise.reject(err);
  });
});

router.onError((err) => {
  setTimeout(() => {
    // TODO  等403页面添加后考虑改为isNeedLoginError
    if (isAuthError(err)) {
      err.redirect = true;
    }
    errHandler(err);
  }, 0);
});

console.log('路由:\n', router.options.routes);

export default router;
