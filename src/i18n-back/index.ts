import App from '@/app';
import i18next from 'i18next';
// import VueI18Next from '@panter/vue-i18next';
import VueI18Next from '@/utils/vue/i18n';
import envs from '@/utils/envs';
import { setLang as elSetLang } from '@/components/element';
import axios from '@/utils/axios';
import first from '@4dst-saas/public-utils/dist/first';
import { parseUrl } from 'query-string';
import keys from '@4dst-saas/public-utils/dist/keys';
// @ts-ignore
import msgEN from './langs/en.json';
// @ts-ignore
import msgCN from './langs/cn.json';


type Values<O> = O extends { [k in any]: infer T } ? T : never;

const langNumMapLang = {
  1: 'en',
  2: 'cn',
} as const;

export type LanguageNum = keyof typeof langNumMapLang;
export type Language = Values<typeof langNumMapLang>;

interface LangConfig {
  name: string
  num: LanguageNum
  lang: Language
  icon: string
}

export const langConfigList: LangConfig[] = [
  {
    name: 'English(英)',
    num: 1,
    lang: 'en',
    icon: require('@/assets/img/lang/icon_en.png'),
  },
  {
    name: '中文(CN)',
    num: 2,
    lang: 'cn',
    icon: require('@/assets/img/lang/icon_cn.png'),
  },
];


export function langNumToLang(langNum: keyof typeof langNumMapLang) {
  return langNumMapLang[langNum];
}

export function getLang(): Language {
  if (envs.VUE_APP_COOPERATION.includes('anta')) return 'cn';
  const queryLang = first(parseUrl(window.location.href).query.language);
  // @ts-ignore
  const _queryLang = Object.values(langNumMapLang).includes(queryLang) ? (queryLang as Language) : undefined;
  return _queryLang
    ?? localStorage.getItem('lang') as Language
    ?? (navigator.language.substring(0, 2) === 'zh' ? 'cn' as const : 'en' as const);
}

if (localStorage.getItem('lang') === 'unknown') {
  localStorage.removeItem('lang');
}
// eslint-disable-next-line import/no-mutable-exports
export let currentLang = getLang();

export { currentLang as defaultLang };


export const langToLangNum = (
  lang: Language | 'unknown',
) => {
  const _lang = (lang === 'unknown' ? currentLang : lang) ?? currentLang;
  return keys(langNumMapLang).find(e => langNumMapLang[e] === _lang);
};

/** @return 是否建议刷新 */
export async function setLang(targetLang: Language) {
  if (localStorage.getItem('lang') !== targetLang) {
    localStorage.setItem('lang', targetLang);
  }
  if (currentLang !== targetLang) {
    elSetLang(targetLang);
    await new Promise((resolve, reject) => {
      i18next.changeLanguage(targetLang, (e) => {
        if (e) reject(e);
        else resolve(undefined);
      });
    });
    const value = langToLangNum(targetLang);
    // if (value) {
    //   try {
    //     await axios({
    //       url: '/msgcenter/config/update',
    //       method: 'post',
    //       data: {
    //         type: 4,
    //         value,
    //       },
    //     });
    //   } catch { }
    // }
    currentLang = targetLang;
    return true;
  }
  return false;
}

i18next.init({
  lng: currentLang,
  resources: {
    cn: { translation: msgCN },
    en: { translation: msgEN },
  },
});

App.use(VueI18Next, { i18n: i18next });
// App.component('i18n', (App as any).options.components.i18next);
// export default new VueI18Next(i18next);

export { i18next as i18n, i18next };
