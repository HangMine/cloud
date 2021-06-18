/* eslint-disable import/prefer-default-export */
import { App } from 'vue';
import isDataPipeUrl from './is-data-pipe-url';
import { isOssUrl, signUrl } from './oss/utils';

export const getPx = (target: string | number) => {
  return typeof target === 'number' ? `${target}px` : target;
};

type ElOrSelector = HTMLElement | string;
export const getEl = (elOrSelector: ElOrSelector) => {
  if (!elOrSelector) return undefined;
  if (elOrSelector instanceof HTMLElement) {
    return elOrSelector;
  }
  return document.documentElement.querySelector(elOrSelector) as HTMLElement;
};


export const pick = <T extends string[]>(obj: Obj, keys: T) => {
  return keys.reduce((_obj, key) => {
    _obj[key] = obj[key];
    return _obj;
  }, {} as Obj);
};

export async function getDownloadUrl(url: string, name?: string) {
  const hasSearch = url.includes('?');
  const prefix = hasSearch ? '&' : '?';
  const contentDisposition = encodeURIComponent(`attachment${name ? `;filename=${name}` : ''}`);
  if (isDataPipeUrl(url)) {
    return `${url}${prefix}response-content-disposition=${contentDisposition}`;
  } if (isOssUrl(url)) {
    return signUrl(`${url}${prefix}response-content-disposition=${contentDisposition}`);
  }
  return url;
}

export const downloadByURL = async (url: string, name: string) => {
  url = await getDownloadUrl(url, name);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
};

export const download = async (url: string, name: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
};

export const isMobile = window.location.pathname.startsWith('/mobile');

export const getApp = async () => {
  let app: App;
  let extendRootApp: (app: App) => void;
  if (isMobile) {
    console.log('手机');
    app = (await import('@/mobile/app')).default;
    extendRootApp = (await import('@/mobile/main')).extendRootApp;
  } else {
    console.log('PC');
    app = (await import('@/app')).default;
    extendRootApp = (await import('@/pc-main')).extendRootApp;
  }
  return { app, extendRootApp };
};

