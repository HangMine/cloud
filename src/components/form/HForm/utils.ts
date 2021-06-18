import { FormItems, Obj } from './type';

type FocusEl = HTMLElement & { focus?: Function };
type FocusObj = FocusEl;
const getClosetScrollEl = (el: HTMLElement): HTMLElement | null => {
  const { scrollHeight, clientHeight } = el;
  if (scrollHeight > clientHeight) {
    return el;
  }
  if (el.parentElement) {
    return getClosetScrollEl(el.parentElement);
  }
  return null;
};
export function focus(el: FocusEl, offsetTop: number): void;
export function focus(el: FocusObj, offsetTop = 0): void {
  if (el.focus) {
    el.focus();
    return;
  }
  if (el instanceof HTMLElement) {
    // 只写这几种先
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) {
      el.focus();
    } else {
      const scrollEl = getClosetScrollEl(el);

      if (scrollEl) {
        scrollEl.scrollTo(0, el.offsetTop + offsetTop);
      }
    }
  }
}
export const unFalsy = (_value: any) => _value || _value === 0;

export const resetParams = (formItems: FormItems) => {
  const params: Obj = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const item of formItems) {
    switch (item.type) {
      case 'input':
      default:
        params[item.key] = '';
        break;
      case 'select':
        params[item.key] = item.multiple ? [] : '';
        break;
      case 'date':
        switch (item.childType) {
          case 'daterange':
          case 'datetimerange':
            params[item.key] = [];
            break;
          default:
            params[item.key] = '';
            break;
        }
        break;
      case 'checkbox':
        params[item.key] = [];
        break;
      case 'switch':
        params[item.key] = false;
        break;
      case 'cascader':
        params[item.key] = [];
        break;
      case 'block':
        break;
    }
    const defaultValue = item.value;
    if (defaultValue !== undefined) params[item.key] = defaultValue;
  }
  return params;
};

export const form2params = (formItems: FormItems) => {
  const showFormItems = formItems.filter(item => {
    return item.show !== false;
  });
  return resetParams(showFormItems);
};
