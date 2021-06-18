import Vue, { App } from 'vue';
import AppError from '@/utils/error';
import errHandler, { isAuthError } from '@/utils/error-handler';
import isNeedValidLoginStatus from '@/router/utils/is-need-valid-login-status';

export default {
  install(_Vue: App) {
    _Vue.config.globalProperties.$Error = AppError;
    _Vue.config.globalProperties.$errHandler = errHandler;
    _Vue.config.globalProperties.$errorHandler = errHandler;
    _Vue.config.errorHandler = function errorHandler(err, vm, info) {
      // vue2版本(ideation项目)的errorHander,会在router.afterEach的setTimeout方法(\src\router\index.ts中定义)后执行.
      // vue3版本的errorHandler似乎会提前到router.afterEach的setTimeout方法前执行,因为errHandler函数里对相同错误做了去重,
      // 导致后端返回的重定向错误(如401)不会执行到redirect的步骤,页面将不跳转登录页.所以对errorHandler加上setTimeout延迟,
      // 需再观察是否有副作用.
      // setTimeout(() => {
      info = `${info}`; //  dev环境抛出了6的数字,估计是vue3info不同导致 ,后续需查明原因
      // TODO: 为解决403跳转，临时增加该代码 后面考虑其他方案
      if (isAuthError(err)) {
        errHandler.call(null, err, true);
        return;
      }
      errHandler.call(vm, err, {
        position: `vue: ${info}`,
        ...(info.startsWith('created') || info.startsWith('mounted') || info.startsWith('v-on') ? {
          level: err.level ?? AppError.LEVELS.ERROR,
          muted: err.muted ?? false,
        } : {
          level: err.level ?? AppError.LEVELS.WARN,
          muted: err.muted ?? true,
        }),
      });
      // }, 0);
    };

    // 捕获未捕获的rejection
    // const handleUnhandledrejection = (event: PromiseRejectionEvent) => {
    //   const hideErrorMesssages = ['Cannot read property \'id\' of undefined'];
    //   if (hideErrorMesssages.includes(event.reason.message)) return;
    //   console.log(event.reason);
    //   const errInfo = event.reason.response ? event.reason.response?.data : event.reason;
    //   // TODO: 为解决403跳转，临时增加该代码 后面考虑其他方案
    //   if (event.reason?.code === 403) {
    //     setTimeout(() => {
    //       errHandler.call(null, errInfo, true);
    //     }, 300);
    //     return;
    //   }
    //   _Vue.config.errorHandler?.(errInfo, null, '未捕获的rejection');
    // };
    // window.removeEventListener('unhandledrejection', handleUnhandledrejection);
    // window.addEventListener('unhandledrejection', handleUnhandledrejection);
  },
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $errHandler: typeof errHandler
    $errorHandler: typeof errHandler
  }
}


