import { RouteLocationRaw as RawLocation } from 'vue-router';
import envs from '@/utils/envs';
import { stringifyUrl } from 'query-string';
import delay from '@4dst-saas/public-utils/dist/delay';
import router from '../router';

type UrlOrUrlFn<T extends RawLocation> = T | (() => (Promise<T> | T));

export async function resolve<T extends RawLocation>(urlOrUrlFn: UrlOrUrlFn<T>) {
  let url: RawLocation;
  if (typeof urlOrUrlFn === 'function') {
    url = await urlOrUrlFn();
  } else {
    url = urlOrUrlFn;
  }
  if (typeof url === 'object') {
    return router.resolve(url).href;
  }
  return url;
}

export async function open<T extends RawLocation>(urlOrUrlFn: UrlOrUrlFn<T>, doesFocus = true) {
  const newWindow = window.open('about:blank', '_blank');
  if (!newWindow) {
    throw new Error('Cannot open window');
  }
  try {
    const url = await resolve(urlOrUrlFn);
    if (doesFocus === false) {
      window.focus();
    }
    newWindow.location.href = stringifyUrl({ url, query: { _: envs.VUE_APP_BUILD_TIME } });
  } catch (e) {
    window.focus();
    if (newWindow) {
      newWindow.close();
    }
    throw e;
  }
  return newWindow;
}

export function untilLoaded(win: Window) {
  return new Promise<Window>((_resolve) => {
    if (win.document.readyState === 'complete') {
      _resolve(win);
    } else {
      win.addEventListener('load', () => {
        _resolve(win);
      });
    }
  });
}

function untilUnloaded(newWindow: Window) {
  return new Promise((_resolve) => {
    const bind = async () => {
      newWindow.removeEventListener('unload', bind);
      await delay(100);
      if (newWindow.closed) {
        _resolve(undefined);
      } else {
        untilUnloaded(newWindow).then(_resolve);
      }
    };
    newWindow.addEventListener('unload', bind);
  });
}

export async function waitClose(newWindow: Window) {
  await untilUnloaded(newWindow);
}

type CacheWindow = {
  [cacheKey: string]: Window
};
const cacheWindow: CacheWindow = {};
export async function openSingleton
<T extends RawLocation>(urlOrUrlFn: UrlOrUrlFn<T>, doesFocus = true, key: keyof CacheWindow) {
  if (!cacheWindow[key] || cacheWindow[key].closed) {
    cacheWindow[key] = await open(urlOrUrlFn, doesFocus);
  } if (doesFocus) {
    cacheWindow[key].location.href = stringifyUrl({ url: await resolve(urlOrUrlFn), query: { _: envs.VUE_APP_BUILD_TIME } });
    cacheWindow[key].focus();
    window.focus();
  }
  return cacheWindow[key];
}
export default open;
