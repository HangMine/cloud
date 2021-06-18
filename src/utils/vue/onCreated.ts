import {
  getCurrentInstance,
} from 'vue';

import { F } from 'ts-toolbelt';

export default async (fn: F.Function) => {
  const inst = getCurrentInstance()!;
  // watchEffect(() => {
  // (async () => {
  try {
    await fn();
  } catch (e) {
    // console.error('error', e);
    const { errorHandler } = inst.appContext.app.config;
    if (errorHandler) {
      errorHandler(e, inst.proxy, 'async created');
    } else {
      throw e;
    }
  }
  // })();
  // });
};
