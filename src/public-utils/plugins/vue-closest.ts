
import Vue, { App } from 'vue';


export function closest(this: Vue, componentName: string) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let vm = this;
  let result;
  while (vm && !result) {
    const name = vm.$options.name || vm.$options;
    if (name === componentName) {
      result = vm;
    }
    vm = vm.$parent;
  }
  return result;
}
export default {
  install(_Vue: App) {
    _Vue.config.globalProperties.$closest = closest;
  },
};
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $closest: typeof closest,
  }
}

