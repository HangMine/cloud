// import { Route } from 'vue-router';

import { RouteLocation } from 'vue-router';

export function isNeedLogin(to: RouteLocation): Boolean {
  const meta = to.meta ?? {};
  if (typeof meta.isNeedLogin !== 'undefined') {
    return meta.isNeedLogin;
  }
  const isEntry = /^\/login/.test(to.path);
  const isQtEntry = /^\/qt\/login/.test(to.path);
  // const isTest = /^\/test/.test(to.path);
  const isPolicy = /^\/policy/.test(to.path);
  const isDoc = /^\/doc/.test(to.path);
  const isFrag = /^\/fragment/.test(to.path);
  const isQtHelpCenter = /^\/qt\/help-center/.test(to.path);
  const isError = /^\/\d/.test(to.path);
  const isMobilePreview = /^\/mobile\/preview/.test(to.path);
  // const isSpecialPage = isEntry || isTest || isPolicy || isDoc || isFrag || isQtHelpCenter || isQtEntry || isError;
  const isSpecialPage = isEntry || isPolicy || isDoc || isFrag || isQtHelpCenter || isQtEntry || isError || isMobilePreview;

  return !isSpecialPage;
}
export default isNeedLogin;
