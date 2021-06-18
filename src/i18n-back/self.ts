import EventEmitter from './event-emitter';
import keySerializer from './key-serializer';

type LangMap = { [key: string]: LangMap | string };
type Options = { lang: string, resources?: { [lang: string]: LangMap } };
type TOptions = { lang?: string, defaultValue?: string };
export class I18n extends EventEmitter<{ loaded: [Options], languageChanged: [string] }> {
  #loadedLangMap: { [lang: string]: LangMap } = {};
  constructor(options?: Options) {
    super();
    if (options) {
      this.init(options);
    }
  }
  language: string;
  /** @private */
  async _changeLanguage(lang: string) {
    this.language = lang;
    let map = this.#loadedLangMap[lang];
    if (!map) {
      ({ default: map } = await import(`./langs/${lang}.json`));
      this.#loadedLangMap[lang] = map;
    }
    return map;
  }
  async changeLanguage(lang: string) {
    this._changeLanguage(lang);
    this.emit('languageChanged', lang);
  }
  async init(options: Options) {
    const { lang, resources } = options;
    Object.assign(this.#loadedLangMap, resources);
    await this._changeLanguage(lang);
    this.emit('loaded', options);
  }
  t(key: string, { lang }?: TOptions): string
  t(key: string, defaultStr: string): string
  t(key: string, defaultStrOrOptions: TOptions | string = {}): string {
    const options: TOptions = typeof defaultStrOrOptions === 'string' ? { defaultValue: defaultStrOrOptions } : defaultStrOrOptions;
    const defaultValue = options.defaultValue ?? '';
    try {
      return keySerializer.get(this.#loadedLangMap[options.lang ?? this.language], key) as string;
    } catch (e) {
      return defaultValue;
    }
  }
}

export default I18n;
