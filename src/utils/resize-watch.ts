import remove from '_/remove';
import ResizeObserver from 'resize-observer-polyfill';

const elsAndCallbacks: Map<HTMLElement, Function[]> = new Map();
const ro = new ResizeObserver(entries => {
  const elsAndCallbacksEntries = Array.from(elsAndCallbacks.entries());
  entries.forEach((entry) => {
    const i = elsAndCallbacksEntries.findIndex(([el]) => el === entry.target);
    if (i !== -1) {
      const [[, fns]] = elsAndCallbacksEntries.splice(i, 1);
      fns.forEach(fn => fn(entry.contentRect));
    }
  });
});
export function resizeWatch(callback: Function, el: HTMLElement = document.documentElement) {
  const fns = elsAndCallbacks.get(el) ?? [];
  fns.push(callback);
  elsAndCallbacks.set(el, fns);
  ro.observe(el);
  return () => {
    remove(fns, callback);
    if (!fns.length) {
      elsAndCallbacks.delete(el);
      ro.unobserve(el);
    }
  };
}
export default resizeWatch;
