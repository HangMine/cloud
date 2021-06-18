/* eslint-disable import/no-named-as-default-member */
import EventEmitter from './event-emitter';
import keySerializer from './key-serializer';
import renderTemplate from './render-template';

type LangMap = { [key: string]: LangMap | string };
export type Options = { lang: string, resources?: { [lang: string ]: LangMap } };
export type TOptions = { lang?: string, defaultValue?: string } & Record<string, unknown>;
export class I18n extends EventEmitter<{ loaded: [Options], languageChanged: [string]}> {
  #loadedLangMap: { [lang: string ]: LangMap } = {};
  #initialazation: Promise<void> | unknown;
  get isInitialized(): boolean {
    return !!this.#initialazation;
  }
  constructor(options?: Options) {
    super();
    if (options) {
      this.init(options);
    }
  }
  language: string;
  /** @private */
  async _changeLanguage(lang: string): Promise<LangMap> {
    this.language = lang;
    let map = this.#loadedLangMap[lang];
    if (!map) {
      ({ default: map } = await import(`./langs/${lang}.json`));
      this.#loadedLangMap[lang] = map;
    }
    return map;
  }
  async changeLanguage(lang: string): Promise<void> {
    await this._changeLanguage(lang);
    this.emit('languageChanged', lang);
  }
  async init(options: Options): Promise<void> {
    this.#initialazation = this.#initialazation ?? (async () => {
      const { lang, resources } = options;
      Object.assign(this.#loadedLangMap, resources);
      await this._changeLanguage(lang);
      this.emit('loaded', options);
    })();
  }
  t(key: string, { lang }: TOptions): string
  t(key: string, defaultStr?: string): string
  t(key: string, defaultStrOrOptions: TOptions | string = { }): string {
    const options: TOptions = typeof defaultStrOrOptions === 'string' ? { defaultValue: defaultStrOrOptions } : defaultStrOrOptions;
    const { defaultValue, lang, ...data } = options;
    let foundTemplate: unknown;
    try {
      foundTemplate = keySerializer.get(this.#loadedLangMap[lang ?? this.language], key);
    } catch {}
    if (foundTemplate) {
      if (typeof foundTemplate !== 'string') throw new TypeError(`国际化${key}的值类型不合法`);
      return renderTemplate(foundTemplate, data);
    }
    console.warn(`未找到${key}的国际化文本`);
    return defaultValue ?? key;
  }
}

export default I18n;
