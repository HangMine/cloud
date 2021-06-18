import { VNode, DirectiveBinding } from 'vue';

function isFocusable(target: unknown): target is { focus: Function } {
  // @ts-ignore
  return typeof target === 'object' && target !== null && typeof target.focus === 'function';
}

export default {
  inserted(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    const comp = vnode.componentInstance;
    if (isFocusable(comp)) {
      comp.focus();
    } else {
      el.focus();
    }
  },
};
