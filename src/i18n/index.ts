/* eslint-disable import/no-named-as-default-member */

import I18nPlugin, { useI18n } from './I18nPlugin';
import I18n from './I18n';
import cn from './langs/cn.json';

const i18n = new I18n();
export const plugin = new I18nPlugin({ i18n, lang: 'cn', resources: { cn } });

export async function setLang(targetLang: string): Promise<boolean> {
  await plugin.changeLanguage(targetLang);
  return true;
}

export { useI18n };

export default i18n;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: typeof i18n.t
  }
}
