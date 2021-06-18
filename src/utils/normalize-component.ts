import envs from './envs';
import isDataPipeUrl from './is-data-pipe-url';

/* eslint-disable import/prefer-default-export */
export function getRelativePathFromUrl(url = ''): string {
  if (/\/datapipe\/repository\//.test(url)) {
    // 提取url中/datapipe/repository/后面至?参数前面的一段路径+名称，即该图片的相对路径
    return url.match(/\/datapipe\/repository\/(.+)\?/)?.[1] || '';
  }
  if (/\.aliyuncs\.com\/(.+?)(\?|$)/.test(url)) {
    return url.match(/\.aliyuncs\.com\/(.+?)(\?|$)/)?.[1] || '';
  }
  return url;
}

function loadImage(url: string, { crossOrigin }: { crossOrigin?: string } = {}) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => {
      resolve(img);
    };
    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }
    img.onerror = () => {
      reject(new Error(`load ${url} error`));
    };
    img.src = url;
  });
}

export async function urlToBlob(url: string, { withCredentials = envs.VUE_APP_IS_REMOTE && isDataPipeUrl(url) } = {}): Promise<Blob> {
  const img = await loadImage(url, { crossOrigin: withCredentials ? 'use-credentials' : 'anonymous' });
  return new Promise<Blob>((resolve, reject) => {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    c.toBlob((result) => {
      if (result) {
        resolve(result);
      } else {
        reject(new Error('Convert blob error'));
      }
    }, 'image/png');
  });
}
