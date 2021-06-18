import {
  App, ref, watch, computed, Ref,
} from 'vue';

import { get } from './key-serializer';

type Obj = { [key in string | number]: unknown };
export type Lang = 'cn' | 'en';

const DEFAULT_LANG = 'cn';

let language: Lang = DEFAULT_LANG;
export const currentLang = ref<Lang>(DEFAULT_LANG);
export const langStore = ref<Obj>({});
watch(currentLang, async () => {
  language = currentLang.value!;
  langStore.value = (await import(`./langs/${currentLang.value}`)).default;
}, { immediate: true });

const t = (key: string, defaultStr = ''): string => {
  try {
    return get(langStore.value, key) ?? defaultStr;
  } catch (e) {
    return defaultStr;
  }
};

const refT = (key: string, defaultStr = ''): Ref<string> => {
  return computed(() => {
    return t(key, defaultStr);
  });
};


const i18n = {
  install(_app: App, { lang = DEFAULT_LANG }: { lang?: Lang } = {}): void {
    _app.config.globalProperties.$t = t;
    currentLang.value = lang;
  },
  t,
  refT,
  language,
};

export const useI18n = (): {
  language: typeof currentLang; // useI18n的language相当于currentLang,方便使用
  langStore: typeof langStore;
  t: typeof refT; // useI18n的t相当于refT,方便使用
} => {
  return {
    language: currentLang, langStore, t: refT,
  };
};

export default i18n;
