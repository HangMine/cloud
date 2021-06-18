import { keys } from '_/keys';
import { App } from 'vue';
import focus from './focus';

const directives = {
  focus,
};

export default {
  install(_Vue: App) {
    keys(directives).forEach(k => {
      _Vue.directive(k, directives[k]);
    });
  },
};
