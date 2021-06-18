import { App } from 'vue';
import history from '@/utils/history';

export default {
  install(_Vue: App, { router }: { router: VueRouter }) {
    history.router = router;
    _Vue.config.globalProperties.$history = history;
  },
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $history: typeof history
  }
}
