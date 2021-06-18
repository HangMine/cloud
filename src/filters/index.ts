import { App } from 'vue';
import thumb from './thumb';
import date from './date';
import byte from './byte';
import lf2p from './lf2p';
import lf2br from './lf2br';

const filters = {
  thumb, date, byte, lf2p, lf2br,
};
export {
  thumb, date, byte, lf2p, lf2br,
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: typeof filters
  }
}


export default {
  install(_Vue: App) {
    _Vue.config.globalProperties.$filters = filters;
  },
};
