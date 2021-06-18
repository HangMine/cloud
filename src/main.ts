/* eslint-disable import/prefer-default-export */
import { getApp } from './utils/util';

(async () => {
  const { app, extendRootApp } = await getApp();
  extendRootApp(app);
  app.mount('#app');
})();


