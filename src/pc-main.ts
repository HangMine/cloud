/* eslint-disable import/prefer-default-export */
import { App } from 'vue';

import VueAct from '@/public-utils/plugins/vue-act';
import errHandler, { isNeedLoginError } from '@/utils/error-handler';
import VueErrorHandler from '@/utils/vue/vue-error-handler';
import VueHistory from '@/utils/vue/vue-history';
import { plugin as VueI18n } from '@/i18n';
import store from './store';
import router from './router';
import components from './components';
import dialog from './utils/vue/dialog';

export const extendRootApp = (app: App) => {
  app.use(store).use(router).use(components)
    .use(dialog)
    .use(VueErrorHandler)
    .use(VueAct, {
      success([msg]: [string]) { this.$message.success(msg); },
      error(error: Error) {
        errHandler.call(this, error);
      },
    })
    .use(VueHistory, {
      router,
    })
    .use(VueI18n);
};

