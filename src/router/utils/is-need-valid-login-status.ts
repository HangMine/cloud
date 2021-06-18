import { RouteLocation } from 'vue-router';

/**
 * @desc 是否需要进入页面后再判断是否已登录
 * @param to
 * @returns {Boolean}
 */
export function isNeedValidLoginStatus(to: RouteLocation): Boolean {
  const needValidLoginStatusPage = /^\/main\/share$/.test(to.path);
  return needValidLoginStatusPage;
}
export default isNeedValidLoginStatus;
