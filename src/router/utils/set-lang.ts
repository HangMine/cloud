import { Language, setLang } from '@/i18n/index';

type ValueOf<T> = T[keyof T];

const langNumMapLang = {
  1: 'en' as const,
  2: 'cn' as const,
  undefined: 'unknown' as const,
};

const langMapTranslatedLang = {
  en: 'english',
  cn: 'simplified_chinese',
  undefined: 'unknown',
};

export {
  langNumToLang as languageNumber2lang,
  langToLangNum as langMapLangNum,
  currentLang as defaultLang,
  langConfigList,
} from '@/i18n/index';
export async function setLanguageAndReload(targetLang: Language, callback = () => window.location.reload()) {
  console.log(targetLang);
  await setLang(targetLang);
  callback();
}
export function lang2TranslatedLang(lang: typeof langNumMapLang) {
  return (
    langMapTranslatedLang[lang as unknown as keyof typeof langMapTranslatedLang]
    || langMapTranslatedLang.undefined
  ) as ValueOf<typeof langMapTranslatedLang>;
}

export default setLanguageAndReload;
