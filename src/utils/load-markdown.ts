import axios from 'axios';
// eslint-disable-next-line
import showdown from 'showdown';

// import { i18n } from '@/i18n';
// import envs from '@/utils/envs';
// const mdBaseUrl = 'https://sdtc-frontend.oss-cn-shenzhen.aliyuncs.com/help-center/staging/';
// const mdBaseUrl = `http://localhost:9200/help-center/${i18n.language}/`;
// const mdBaseUrl = `${envs.VUE_APP_HELP_CENTER_URL}/${i18n.language}/`;


function decodeHtml(str: string) {
  const temp = document.createElement('div');
  temp.innerHTML = str;
  return temp;
}

const loadMarkdown = axios.create({
  // baseURL: mdBaseUrl,
});
const convertor = new showdown.Converter();
loadMarkdown.interceptors.response.use((resp) => {
  return {
    status: resp.status,
    statusText: resp.statusText,
    headers: resp.headers,
    config: resp.config,
    lastModified: resp.headers['last-modified'],
    contentMd5: resp.headers['content-md5'],
    // data: (new DOMParser().parseFromString(`<div>${convertor.makeHtml(resp.data)}</div>`, 'text/xml')).children[0],
    data: decodeHtml(convertor.makeHtml(resp.data)),
  };
});

export default async (path: string, query = '', imgRebasePath = '.') => {
  const resp = await loadMarkdown.get(`${path}${query}`);
  const { data: dom }: { data: HTMLDivElement} = resp;
  Array.from(dom.querySelectorAll('a')).forEach((a) => {
    const href = a.getAttribute('href')?.replace(/\.md$/, '');
    href && a.setAttribute('href', href);
  });
  Array.from(dom.querySelectorAll('img')).forEach((img) => {
    img.setAttribute('src', `${path}/${imgRebasePath}/${img.getAttribute('src')}`);
  });
  return resp;
};
