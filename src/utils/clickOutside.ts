import delay from '@4dst-saas/public-utils/dist/delay';

type ElOrSelector = HTMLElement | HTMLElement[] | string;

const getEls = (elOrSelector: ElOrSelector) => {
  if (elOrSelector instanceof HTMLElement) {
    return [elOrSelector];
  } if (Array.isArray(elOrSelector)) {
    return elOrSelector;
  } return [...document.documentElement.querySelectorAll(elOrSelector)] as HTMLElement[];
};

const beIncluded = (target: HTMLElement, parentEls: HTMLElement[]): boolean => {
  if (parentEls.includes(target)) {
    return !!target;
  } if (target.parentElement) {
    return !!beIncluded(target.parentElement, parentEls);
  }
  return false;
};

type MouseEventKey = 'click' | 'mouseup' | 'mousedown';
const clickOutside = {
  handleClick: null as unknown as (e: MouseEvent) => void | null,
  bind: async (elOrSelector: ElOrSelector, mouseEventKey: MouseEventKey = 'click') => {
    return new Promise((resolve, reject) => {
      clickOutside.handleClick = (e: MouseEvent) => {
        const els = getEls(elOrSelector);
        if (!els) {
          throw new Error('非法元素');
        }
        if (!beIncluded(e.target as HTMLElement, els)) {
          resolve(e);
          clickOutside.unBind(mouseEventKey);
        }
      };
      document.body.addEventListener(mouseEventKey, clickOutside.handleClick);
    });
  },
  unBind: (mouseEventKey: MouseEventKey) => {
    document.body.removeEventListener(mouseEventKey, clickOutside.handleClick);
  },
};

export default clickOutside;
