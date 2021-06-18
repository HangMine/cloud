import '@/styles/element/index.scss';
import Element, { ElMessageBox } from 'element-plus';
import en from 'element-plus/lib/locale/lang/en';
import cn from 'element-plus/lib/locale/lang/zh-cn';
import locale from 'element-plus/lib/locale';
import AppError from '@/utils/error';
import i18n from '@/i18n';


export async function confirmBool(...args) {
  const cancelButtonClass = `button-cancel ${args[2]?.cancelButtonClass || ''}`;
  args[2] = { ...args[2], cancelButtonClass };
  try {
    await ElMessageBox.confirm(...args);
    return true;
  } catch (e) {
    return false;
  }
}

async function confirm(message, titleOrOptions, options) {
  try {
    // 判断是否有option
    if (!options) {
      if (typeof titleOrOptions === 'string') {
        if (titleOrOptions !== '') {
          options = message ? { customClass: 'with-desc' } : {};
          return await ElMessageBox.confirm(message, titleOrOptions, options);
        }
        return await ElMessageBox.confirm('', message);
      }
      if (typeof titleOrOptions === 'object') {
        return await ElMessageBox.confirm('', message, titleOrOptions);
      }
      if (typeof titleOrOptions === 'undefined') {
        return await ElMessageBox.confirm('', message);
      }
    }
    if (titleOrOptions === '') {
      return await ElMessageBox.confirm('', message, options);
    }
    return await ElMessageBox.confirm(message, titleOrOptions,
      {
        ...options,
        customClass: `${options?.customClass ?? ''} ${message ? 'with-desc' : ''} ${options?.type === 'warning' ? 'with-warning' : ''}`,
      });
  } catch (e) {
    throw AppError.abort;
  }
}
export { confirm };

export async function alert(...args) {
  try {
    if (typeof args[2] === 'object' && args[1] && args[0]) {
      args[2].customClass = `${args[2].customClass ?? ''} with-desc`;
    }
    return await ElMessageBox.alert(...args);
  } catch (e) {
    throw AppError.abort;
  }
}

export async function prompt(...args) {
  const cancelButtonClass = `button-cancel ${args[2]?.cancelButtonClass || ''}`;
  args[2] = { ...args[2], cancelButtonClass };
  try {
    return await ElMessageBox.prompt(...args);
  } catch (e) {
    throw AppError.abort;
  }
}


export const setLang = (lang: string) => {
  if (lang === 'en') {
    locale.use(en);
  } else {
    locale.use(cn);
  }
};

export default {
  install(Vue) {
    setLang(i18n.language);

    Vue.use(Element);


    Vue.prototype.$alert = alert;
    Vue.prototype.$confirmBool = confirmBool;
    Vue.prototype.$confirm = confirm;
    Vue.prototype.$prompt = prompt;
  },
};
