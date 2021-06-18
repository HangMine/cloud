import { DirectiveOptions } from 'vue';

const clickOutsideEventHandlerKey = 'clickOutsideEvent' as const;

type ElementWithClickOutsideHandler = HTMLElement & { [clickOutsideEventHandlerKey]: (event: MouseEvent) => void };

const clickoutside: DirectiveOptions = {
  bind(_el, binding, vnode) {
    // eslint-disable-next-line
    const el = _el as ElementWithClickOutsideHandler;
    el[clickOutsideEventHandlerKey] = function clickOutsideEventHandler(event: MouseEvent) {
      // here I check that click was outside the el and his childrens
      if (event.target instanceof Node && !(el === event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        // eslint-disable-next-line no-eval
        // eval(binding.expression).call(vnode.context, event);
        vnode.context![binding.expression as keyof NonNullable<(typeof vnode)['context']>](event);
      }
    };
    document.body.addEventListener('click', el[clickOutsideEventHandlerKey]);
  },
  unbind(_el) {
    const el = _el as ElementWithClickOutsideHandler;
    document.body.removeEventListener('click', el[clickOutsideEventHandlerKey]);
  },
};

export default clickoutside;
