/* eslint-disable import/no-named-as-default-member */
import {
  getCurrentInstance, App as VueApp, ref, computed, Ref,
} from 'vue';
import I18n, { Options as I18nOptions } from './I18n';

class I18nPlugin {
  #language = ref<string>();
  #i18n!: I18n;
  /** @readonly */
  get language(): string | undefined {
    return this.#language.value;
  }
  async changeLanguage(lang: string): Promise<void> {
    await this.#i18n.changeLanguage(lang);
    this.#language.value = lang;
  }
  t(key: string, defaultValue = ''): string {
    return this.#i18n.t(key, { lang: this.#language.value, defaultValue });
  }
  constructor({ i18n, ...options }: { i18n: I18n } & I18nOptions) {
    this.#i18n = i18n;
    i18n.init(options).then(() => {
      this.#language.value = i18n.language;
    });
  }
  install(_Vue: VueApp): void {
    // _Vue.config.globalProperties.$i18next = this;
    _Vue.config.globalProperties.$t = this.t.bind(this);
  }
}


export const useI18n = (): {
  changeLanguage: (lang: string) => Promise<void>,
  t: (key: string, defaultValue?: string) => string,
  language: Ref<string | undefined>
} => {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('Please use hook in setup');
  }

  const i18n: I18nPlugin = instance.appContext.config.globalProperties.$i18next;
  return {
    language: computed(() => {
      return i18n.language;
    }),
    changeLanguage: (lang: string) => i18n.changeLanguage(lang),
    t(key: string, defaultValue = ''): string {
      return i18n.t(key, defaultValue);
    },
  };
};

export default I18nPlugin;
