import Vue, { App } from 'vue';
import relation from '_/relation';
import AnyFunction from '../../typings/any-funtion.d';

type ActCache = { [cacheKey: string]: Promise<any> | null };
function getActionMethod(vm: Vue, fnOrFnName: AnyFunction | string) {
  if (typeof fnOrFnName === 'function') {
    return fnOrFnName;
  }
  if (typeof vm[fnOrFnName as keyof typeof vm] === 'function') {
    return vm[fnOrFnName as keyof typeof vm];
  }
  throw new Error('Not a function');
}

const cacheMapKey = 'actCache$' as const;

type VueWithActCache = Vue & { [cacheMapKey]: ActCache };

function isActing(this: Vue, fn: AnyFunction) {
  fn = getActionMethod(this, fn);
  const cacheKey = relation(this, fn);
  const self = this as VueWithActCache;
  return !!self[cacheMapKey][cacheKey];
}
type SuccessFn = (this: Vue, ...args: any[]) => any;
type ErrorFn = (this: Vue, ...args: any[]) => any;
export default {
  install<S extends SuccessFn, E extends ErrorFn>(
    _Vue: App, { success, error }: { success: SuccessFn, error: ErrorFn },
  ) {
    type ParametersOfS = Parameters<S>;
    type ParametersOfE = Parameters<E>;
    async function act(
      this: VueWithActCache, fnOrFnName: AnyFunction | string,
      args: any[] = [],
      successParams: ParametersOfS | ParametersOfS[0],
      errorParams: ParametersOfE | ParametersOfE[0],
    ) {
      const fn: AnyFunction = getActionMethod(this, fnOrFnName);
      const cacheKey = relation(this, fn);
      try {
        // let cache = this._actCache[cacheKey];
        let cache = this[cacheMapKey][cacheKey];
        if (!cache) {
          cache = fn.call(this, ...args);
          this[cacheMapKey][cacheKey] = cache;
          // _Vue.set(this[cacheMapKey], cacheKey, cache);
        }
        const r = await cache;
        let _successParams: ParametersOfS;
        if (successParams) {
          if (Array.isArray(successParams)) {
            _successParams = successParams;
          } else {
            _successParams = [successParams] as ParametersOfS;
          }
          success.call(this, ..._successParams);
        }
        return r;
      } catch (e) {
        let _errorParams: ParametersOfE;
        if (Array.isArray(errorParams)) {
          _errorParams = errorParams;
        } else {
          _errorParams = [errorParams] as ParametersOfE;
        }
        error.call(this, e as Error, ..._errorParams);
        return e;
      } finally {
        this[cacheMapKey][cacheKey] = null;
        // this.$set(this[cacheMapKey], cacheKey, null);
      }
    }

    function action(
      this: VueWithActCache,
      fnOrFnName: AnyFunction | string,
      successParams: ParametersOfS | ParametersOfS[0],
      errorParams: ParametersOfE | ParametersOfE[0],
    ) {
      return function wrapFn(this: VueWithActCache, ...args: any[]) {
        act.call(this, fnOrFnName, args, successParams, errorParams);
      };
    }

    // _Vue.prototype.$action = action;
    // _Vue.prototype._actCache = s.actCache;
    // _Vue.prototype.$isActing = isActing;
    // _Vue.prototype.$act = act;

    _Vue.mixin({
      data() {
        return {
          [cacheMapKey]: {},
        };
      },
      methods: {
        // @ts-ignore
        $isActing: isActing,
        // @ts-ignore
        $act: act,
        // @ts-ignore
        $action: action,
      },

    });
  },
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $act: (fn: AnyFunction | string, args?: any[], successParams?: any, errorParams?: any) => any
    $action: (fn: AnyFunction | string, successParams?: any, errorParams?: any) =>
    (this: Vue, ...args: any[]) => any
    $isActing: typeof isActing
    _actCache: ActCache
  }
}
