import { ElMessage, ElMessageBox } from 'element-plus';
import { throttle } from 'throttle-debounce';
import Vue, { ComponentPublicInstance } from 'vue';
import i18n from '@/i18n';
import AppError from '@/utils/error';
import extract from '_/extract';
import Axios from 'axios';
import envs from '@/utils/envs';
import {
  clearContext, getContextUser, getContextUserId, updateContextUser,
} from '@/loaders/context';
import { md5 } from '@4dst-saas/public-utils/dist/blob-utils';
import dayjs from 'dayjs';
import tryParseJson from '@4dst-saas/public-utils/dist/try-parse-json';
import { dialogs } from '@/utils/vue/dialog';
import { instance as history } from './history';
import LogPoster, { Response } from './log-poster';
import {
  Obj, getType, deepCopy, $continue,
} from './deep-copy';


/* ---------------- */
/* errorHandler理解：
* 错误处理采用全局捕获方法，unhandledrejection错误处理事件只适用于Webket浏览器，
* 为兼容性考虑，全局捕获自行实现，主要包含以下部分：
* 1. router跳转时的权限校验，采用router.onError捕获
* 2. 请求返回的权限错误，由axiosUnbind方法(/router/index.ts)实现(废弃，统一由vue.config.errorHandler处理)
* 3. 初始化setup中的错误，由自行实现的onCreated实现
* 4. 其他错误（如v-on绑定，生命周期钩子），由vue.config.errorHandler绑定
*/
export type _ErrorLike = {
  name?: string
  code?: number
  title?: string
  message: string
  position?: string
  level?: number
  data?: unknown
  redirect?: true | false | RedirectParams
  type?: string
  muted?: boolean
  instance?: unknown
  feCodeError?: boolean
  hash?: string
};
type ErrorLike = _ErrorLike & { [otherProps: string]: any };

const { LEVELS } = AppError;
type ErrorLikeComputed = Omit<_ErrorLike, 'type' | 'muted' | 'redirect'> & {
  type: string,
  muted: boolean,
  redirect: false | RedirectParams,
  feCodeError: boolean
} & { [otherProps: string]: any };


let logPoster: LogPoster | undefined;
if (envs.VUE_APP_IS_REMOTE && ['staging', 'uat', 'production'].includes(envs.VUE_APP_MODE)) {
  logPoster = new LogPoster({
    storageKey: 'errors',
    async post(logs) {
      const res: Response = (await Axios.post('//front-log.4dshoetech.com/errorlog', logs)).data;
      return res;
    },
  });
}

const HANDLED = Symbol('error has handled');

// eslint-disable-next-line @typescript-eslint/ban-types
function isNativeFunction(fun: Function) {
  return fun.toString().includes('[native code]');
}

export function isError(e: unknown): e is ErrorLike {
  return typeof e === 'object' && !!e && 'message' in e;
}

export function isAuthError(e: unknown): e is ErrorLike {
  return isError(e) && !!e.code
    && (`${e.code}`.endsWith('403')
      || `${e.code}`.endsWith('401'));
}

export function isNeedLoginError(e: unknown): e is ErrorLike {
  return isError(e) && !!e.code
    && `${e.code}`.endsWith('401');
}

export function isAbortError(e: unknown): e is ErrorLike {
  return isError(e) && !!e.code && `${e.code}`.endsWith('499');
}

export function isEmptyError(e: unknown): e is ErrorLike {
  return isError(e) && !!e.code && `${e.code}`.endsWith('404');
}


function isFECodeError(e: ErrorLike) {
  const _e = e._original ?? e;
  return (!!_e.constructor
    // 必须是Error的的实例但不是Error的直接实例，因为一般的Error一般情况并不是系统抛出来的
    // 或者系统抛出来的错误，例如Edge，是携带description的
    // 因为new Error api 是没有 description 的选项的
    && _e instanceof Error
    && (_e.constructor !== Error || (_e.constructor === Error && !!_e.description))
    // 必须是浏览器自带的构造器，而不是AppError或者其他
    && isNativeFunction(_e.constructor));
}

function isCodeError(e: ErrorLike) {
  return e.code === 100500 || isFECodeError(e);
}


const errorLevelNames: {
  [level: number]: string,
} = {
  '-2': '提示',
  '-1': '警告',
  0: '一般',
  1: '严重',
};

const badgeStyle = 'padding-left: .5em; margin-left: .5em; padding-right: .5em; margin-right: .5em; border-radius: 2px';

const errorLevelColor: {
  [level: number]: string,
} = {
  '-2': '#09c',
  '-1': '#f80',
  0: '#ff8080',
  1: '#f44',
};

function getTypedBadgeStyle(level: number) {
  return `color: white; background: ${errorLevelColor[level]}; ${badgeStyle}`;
}

export function getMessage(e: ErrorLike) {
  // 如果是代码的错误，对于客户来说是屏蔽的，所以后端100500的错误，以及前端的逻辑错误都显示系统异常，
  const { message, code, hash } = e;
  if (isCodeError(e) && envs.VUE_APP_MODE !== 'development') {
    const isFE = isFECodeError(e);
    return `${i18n.t('public.code_msg._100500')} ${isFE && hash ? `(F-${hash.substr(0, 10)})` : ''}`;
  }
  return i18n.t(`public.code_msg._${code}`, message);
}

const level2errType: {
  [level: number]: 'error' | 'info' | 'warning'
} = {
  [LEVELS.ERROR]: 'error',
  [LEVELS.INFO]: 'info',
  [LEVELS.WARN]: 'warning',
};

const noAuthRedirect = (e: ErrorLike) => {
  return {
    path: '/403',
    query: {
      message: e.message,
      code: e.code,
    },
  };
};

const needLoginRedirect = (e: ErrorLike) => {
  clearContext();
  if (window.location.href.includes(envs.VUE_APP_LOGIN_URL)) {
    return false;
  }
  return {
    path: envs.VUE_APP_LOGIN_URL,
    query: {
      message: e.message,
      code: e.code,
      redirect: globalThis.location.href,
    },
  };
};
type RedirectParams = {
  path?: string,
  name?: string,
  query?: {
    message: string,
    code?: number
  }
} | string;
const code2RedirectParams: {
  [code: number]: (e: { code: number, message: string }) => false | RedirectParams;
} = {
  401: needLoginRedirect,
  403: needLoginRedirect, // TODO: 为解决403跳转，临时修改
  100401: needLoginRedirect,
  100403: needLoginRedirect, // TODO: 为解决403跳转，临时修改
};


const defaultRedirectParams = (e: { code: number, message: string }): RedirectParams => ({
  path: `/${e.code}`,
  query: { message: e.message, code: e.code },
});

const showError = throttle(2000, (e: ErrorLikeComputed) => {
  const {
    code, type,
  } = e;
  const _message = getMessage(e);
  if (code === 100403 || code === 100404) {
    ElMessageBox.alert(_message, i18n.t('public.dialog.notice'));
  } else if (type === 'success' || type === 'warning' || type === 'error' || type === 'info') {
    ElMessage[type](_message);
  }
});

const getCompName = (vm: ComponentPublicInstance) => (vm.$options as unknown as any)._componentTag || vm.$options.name || '';

const getFilterLogData = (data: Obj = {}) => {
  const result = deepCopy(data, {
    filter: ({
      key, value, layer, copy, getShadowValue,
    }) => {
      const noLogProps = ['instanceErrors_'];
      if (noLogProps.includes(`${key}`)) return $continue;
      if (getType(value) === 'Function') return $continue;
      return layer < 3 ? copy() : getShadowValue(value);
    },
  });
  return result;
};

const getLocalLogData = () => {
  const result = deepCopy(localStorage, {
    filter: ({
      key, value, layer, copy, getShadowValue,
    }) => {
      const parseValue = tryParseJson(value);
      const noLogPropsReg = /^__xstorage|errors|vuex/;
      if (noLogPropsReg.test(`${key}`)) return '__continue__';
      if (getType(parseValue) === 'Function') return '__continue__';
      return layer < 3 ? copy() : getShadowValue(parseValue);
    },
  });
  return result;
};

const getVmData = (vm?: ComponentPublicInstance & { [key in string | number]: any }) => {
  if (!vm) return {};
  const resData = Object.keys(vm).reduce((obj, key) => {
    if (!/^(_|\$)/.test(key)) obj[key] = vm[key];
    return obj;
  }, {} as { [key in string | number]: any });
  return resData;
};


let noUpdateContextUser = false; // 只更新一次contextUser避免接口获取用户失败时重复调接口获取
export const logError = async (e: ErrorLike) => {
  const {
    level = 0, redirect, name, message, position, instance, hash,
  } = e;

  const log = [];
  const params = [];
  const originE = e._original;
  const { feCodeError } = e;
  if (position) {
    log.push(`在 %c${position}%c`);
    params.push('color: #2878ff', '');
  }
  if (isAbortError(originE)) {
    log.push('用户触发了一次取消行为的错误，该错误仅供开发调试用');
  } else if (isAuthError(originE)) {
    log.push('触发了一次权限的错误');
  } else {
    log.push(`触发了%c${errorLevelNames[level]}错误%c\n%c${name}: ${message}%c`);
    params.push(getTypedBadgeStyle(level), '', `color: ${errorLevelColor[level]}`, '');
  }

  if (redirect) {
    log.push('该错误会标记了以下错误转跳页，请排查:\n%o');
    params.push(redirect);
  }
  console.groupCollapsed(log.join('\n'), ...params);

  let file: string | undefined;

  if (file) {
    console.info(
      '文件:\n%s',
      file,
    );
  }
  if (instance) {
    console.info('实例:\n%o', instance);
  }
  if (
    logPoster
    // 有元错误，以及是前端的错误
    && feCodeError
  ) {
    let user = getContextUser();
    if (!user && !noUpdateContextUser) {
      try {
        await updateContextUser();
        user = getContextUser();
      } catch (error) {
        noUpdateContextUser = true;
      }
    }

    const serverLog = {
      versionHash: envs.VUE_APP_VERSION_HASH ?? 'NO_VERSION_HASH',
      env: envs.VUE_APP_MODE,
      userAgent: navigator.userAgent,
      file: file ?? '',
      message,
      stack: originE.stack,
      position,
      name,
      level,
      hash,
      project: envs.VUE_APP_MODULE_NAME,
      ref: envs.VUE_APP_REF_NAME,
      user: {
        id: getContextUserId(),
        account: user?.mail ?? user?.account,
      },
      url: window.location.href,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      // localStorage: getLocalLogData(),
    };
    console.info('以下信息会被提交到服务端：\n%o', serverLog);
    logPoster.push(serverLog);
  }

  console.error(originE);
  console.groupEnd();
};

export function parseError<T>(e: ErrorLike, instance?: T, mixinOrLevel?: number | boolean | Partial<ErrorLike>) {
  let levelOrTopLevel: number | boolean | undefined;
  let mixin: Partial<ErrorLike> = {};
  if (typeof mixinOrLevel === 'number' || typeof mixinOrLevel === 'boolean') {
    levelOrTopLevel = mixinOrLevel;
  }
  if (typeof mixinOrLevel === 'object') {
    mixin = mixinOrLevel;
  }
  const feCodeError = isFECodeError(e);


  let level: number | undefined;
  if (typeof levelOrTopLevel === 'boolean') {
    level = levelOrTopLevel ? LEVELS.DANGER : LEVELS.ERROR;
  } else if (typeof levelOrTopLevel === 'number') {
    level = levelOrTopLevel;
  } else {
    level = e.level ?? 0;
  }

  const hash = e.stack ? md5(e.stack) : undefined;
  const code = e.code ?? 400;

  const message = e.message ?? 'Unknow Error';

  let redirect: false | RedirectParams;
  const enableRedirect = !!e.redirect || (e.redirect === undefined && level === LEVELS.DANGER);
  if (enableRedirect) {
    redirect = (e.redirect === true ? undefined : e.redirect) ?? (
      code && code2RedirectParams[code] ? code2RedirectParams[code] : defaultRedirectParams)({ code, message });
  } else {
    redirect = false;
  }

  const type = e.type
    ?? level2errType[level] ?? level2errType[LEVELS.ERROR];
  const muted = e.muted ?? (level === LEVELS.INFO || e.name === 'NavigationDuplicated');

  return {
    name: 'Error',
    message,
    ...extract(e, ['position', 'name', 'level', 'code', 'data', 'message', 'redirect', 'type', 'muted', 'instance']),
    ...mixin,
    redirect,
    type,
    muted,
    code,
    instance,
    feCodeError,
    hash,
    _original: e,
  } as ErrorLikeComputed;
}


function errHandler<T>(this: T, e: ErrorLike, level?: number): void;
function errHandler<T>(this: T, e: ErrorLike, topLevel?: boolean): void;
function errHandler<T>(this: T, e: ErrorLike, mixin?: Partial<ErrorLike>): void;
function errHandler<T>(
  this: T,
  e: ErrorLike,
  mixinOrLevel?: number | boolean | Partial<ErrorLike>,
) {
  if (typeof e !== 'object' || !e) {
    e = new Error(typeof e === 'string' ? e : 'Unknow Error');
  }
  // @ts-ignore
  if (e[HANDLED]) {
    logError(e);
    return;
  }

  // @ts-ignore
  e[HANDLED] = true;

  const computedError = parseError(e, this, mixinOrLevel);

  logError(computedError);
  console.log(computedError);
  const { redirect: redirectParams } = computedError;
  if (redirectParams) {
    // TODO: 为解决403跳转，跳转后关闭弹窗
    dialogs.forEach(dialog => dialog?.dialogWrapVm?.cancel());
    // @ts-ignore
    history.replace(redirectParams);
  } else if (!computedError.muted) {
    showError(computedError);
  }
}
export default errHandler;
export { errHandler, errHandler as handler };
