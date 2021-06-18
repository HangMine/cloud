/// <reference path = "vue-wait-until.d.ts" />
export function waitUntil(eventTypes, rejectEventTypes = []) {
  return new Promise((resolve, reject) => {
    if (eventTypes && !Array.isArray(eventTypes)) {
      eventTypes = [eventTypes];
    }
    // eslint-disable-next-line prefer-const
    let _resolve;
    // eslint-disable-next-line prefer-const
    let _reject;
    function unbind() {
      eventTypes.forEach(t => {
        this.$off(t, _resolve);
      });
      rejectEventTypes.forEach(t => {
        this.$off(t, _reject);
      });
    }
    _resolve = (evt) => {
      resolve(evt);
      unbind();
    };
    _reject = (evt) => {
      const e = new Error();
      e.event = evt;
      reject(e);
      unbind();
    };
    eventTypes.forEach((t) => {
      this.$on(t, _resolve);
    });
    rejectEventTypes.forEach(t => {
      this.$off(t, _reject);
    });
  });
}

export default {
  install(Vue) {
    Vue.prototype.$waitUntil = waitUntil;
  },
};
