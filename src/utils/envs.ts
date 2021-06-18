const DEV = 'development';
const SIT = 'staging';
const UAT = 'uat';
const ART = 'art';

const module2env = (module: string) => {
  const map: Obj = {
    'dev-meterial': DEV,
  };
  return map[module] ?? DEV;
};

const parseUrl = () => {
  const { hostname, pathname } = window.location;
  const [TLD, FLD, module] = hostname.split('.').reverse();
  return {
    hostname,
    pathname,
    TLD,
    FLD,
    module,
  };
};

const {
  hostname, pathname, TLD, FLD, module,
} = parseUrl();
const env = module2env(module);

const getCookieDomain = () => {
  const { VUE_APP_IS_REMOTE: isRemote } = process.env;
  let cookieDomain: string;
  if (isRemote) {
    cookieDomain = hostname.split('.').slice(-2).join('.');
  } else {
    cookieDomain = hostname;
  }
  return cookieDomain;
};

const getPolicyUrl = () => {
  const policyEnv = env === SIT ? DEV : env;
  return `//sdtc-public-picture.4dshoetech.com/policy/${policyEnv}`;
};

const mode2ApiDomain = {
  sit: 'sit.4dshoetech.local',
  staging: 'sit.4dshoetech.local',
  production: '3dmtlink.com',
  uat: 'uat.4dshoetech.com',
  development: 'dev.4dshoetech.local',
  // development: 'dev1.4dshoetech.local',
};
const mode = process.env.VUE_APP_MODE as keyof typeof mode2ApiDomain | undefined ?? 'development';
export default {
  VUE_APP_API_DOMAIN: mode2ApiDomain[mode],
  VUE_APP_LOGIN_URL: '/login',
  VUE_APP_MODE: mode,
  VUE_APP_IS_REMOTE: process.env.VUE_APP_IS_REMOTE,
  VUE_APP_VERSION_HASH: process.env.VUE_APP_VERSION_HASH,
  VUE_APP_CAPTCHA_APP_ID: process.env.VUE_APP_CAPTCHA_APP_ID,
  VUE_APP_COOKIE_DOMAIN: getCookieDomain(),
  VUE_APP_POLICY_URL: getPolicyUrl(),
};
