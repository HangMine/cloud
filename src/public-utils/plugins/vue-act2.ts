import { F } from 'ts-toolbelt';
import { ComponentPublicInstance, App } from 'vue';
import relation from '@4dst-saas/public-utils/dist/relation';
import { CacheableOptions } from '@4dst-saas/public-utils/dist/cacheable';

type Vue = ComponentPublicInstance;
type VueApp = App;

const sblAction = Symbol('action');
type AnyFunction = F.Function & { [sblAction]?: F.Function };
type ActCache = { [cacheKey: string]: Promise<any> | null };
type PickTypeFields<T, K> = { [P in keyof T]: T[P] extends K ? P : never }[keyof T];
type FnNameOf<V extends Vue> = Extract<PickTypeFields<V, Function>, string>;


function getActionMethod<Fn extends F.Function>(vm: Vue, fn: Fn): Fn;
function getActionMethod<V extends Vue, FnName extends FnNameOf<V>>(vm: Vue, fnName: FnName): V[FnName];
function getActionMethod(vm: Vue, fnName: string): F.Function;
function getActionMethod(vm: Vue, fnOrFnName: F.Function | string): F.Function {
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
type Hook = (vm: Vue, ...args: any[]) => any;
type Options<F extends F.Function = F.Function> = {
  extraParams?: unknown | unknown[],
  cacheable?: CacheableOptions<F>,
};
function isOptions(extraParamsOrOptions: unknown): extraParamsOrOptions is Options {
  return typeof extraParamsOrOptions === 'object' && !Array.isArray(extraParamsOrOptions);
}
export default {
  install<S extends Hook, E extends Hook, B extends Hook>(
    _Vue: VueApp, { before, success, error }: { before: B, success: S, error: E },
  ) {
    function action<Fn extends F.Function>(this: Vue, fn: Fn, extraParamsOrOptions: Options<Fn> | Options<Fn>['extraParams']): Fn;
    function action<V extends Vue, FnName extends FnNameOf<V>>(vm: Vue,
      fnName: FnName, extraParamsOrOptions: Options<V[FnName]> | Options<V[FnName]>['extraParams']): V[FnName];
    function action(
      this: Vue,
      fnOrFnName: unknown,
      extraParamsOrOptions: Options | Options['extraParams'] = {
        extraParams: [],
      },
    ) {
      const _f = getActionMethod(this, fnOrFnName as string);
      // @ts-ignore
      const fn: typeof _f & { [sblAction]: typeof _f } & F.Function = _f;
      const options: Options = isOptions(extraParamsOrOptions) ? extraParamsOrOptions : { extraParams: extraParamsOrOptions };
      if (fn[sblAction]) {
        return fn[sblAction];
      }
      async function wrapFn(this: VueWithActCache, ...args: any[]) {
        const { extraParams: _extraParams } = options;
        const extraParams = (Array.isArray(_extraParams) ? _extraParams : [_extraParams]) as unknown[];
        const cacheKey = relation(this, fn);
        before(this, extraParams, fn, ...args);
        try {
          let cache = this[cacheMapKey][cacheKey];
          if (!cache) {
            cache = fn.call(this, ...args);
            this[cacheMapKey][cacheKey] = cache;
          }
          const r = await cache;
          success(this, extraParams, fn, ...args);
          return r;
        } catch (e) {
          error(this, e as Error, extraParams, fn, ...args);
          return e;
        } finally {
          this[cacheMapKey][cacheKey] = null;
        }
      }
      fn[sblAction] = wrapFn;
      return fn[sblAction];
    }

    function act<Fn extends F.Function>(this: Vue,
      fn: Fn, args: unknown[], extraParamsextraParamsOrOptions: Options<Fn> | Options<Fn>['extraParams']): ReturnType<Fn>;
    function act<V extends Vue, FnName extends FnNameOf<V>>(vm: Vue,
      fnName: FnName, args: unknown[], extraParamsOrOptions: Options<V[FnName]> | Options<V[FnName]>['extraParams']): ReturnType<V[FnName]>;
    async function act(
      this: Vue, fnOrFnName: unknown,
      args: any[] = [],
      extraParamsOrOptions: Options | Options['extraParams'] = {
        extraParams: [],
      },
    ) {
      // @ts-ignore
      return action.call(this, fnOrFnName as string, extraParamsOrOptions).call(this, ...args);
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
    $act: (fn: F.Function | string, args?: any[], successParams?: any, errorParams?: any) => any
    $action: (fn: F.Function | string, successParams?: any, errorParams?: any) =>
    (this: ComponentPublicInstance, ...args: any[]) => any
    $isActing: typeof isActing
    _actCache: ActCache
  }
}
