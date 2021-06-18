import { Component } from 'vue';
import {
  RouteLocation as Route, RouteRecordRaw as RouteConfig,
  NavigationGuard, Router as VueRouter,
} from 'vue-router';
import { L } from 'ts-toolbelt';

import keys from '_/keys';

type Dictionary<T> = { [key: string]: T };


/**
 * 将 vue route 内的参数整合到一个对象中
 * @param route vue route object
 * @param types 参数对应的类型转换对象
 * @param defaults 这个对象会被混合到props作为默认值
 */
export function concatProps(
  route: Route,
  types: { [key: string]: (from: any) => any } = {},
  defaults: { [key: string]: any } = {},
) {
  const props = {
    ...defaults,
    hash: route.hash,
    path: route.path,
    meta: { ...route.meta },
    ...route.query,
    ...route.params,
  };

  // 根据 types 里面的预定义的类型，对 props 对象进行数据类型转换
  keys(props).forEach(k => {
    if (k === 'meta') return;
    if (types[k] && props[k] != null) {
      if (types[k] === Boolean) {
        props[k] = JSON.parse(props[k]);
      } else { props[k] = types[k](props[k]); }
    }
  });

  return props;
}

const SAME_PROPS = Symbol('same props');
const GET_PROPS = 'getProps';
const BEFORE_UPDATE = 'beforeUpdate';
const CURRENT_ROUTE = Symbol('route');
type Props = typeof concatProps;
type RestParamsOfConcatProps = L.Tail<Parameters<Props>>;
function withSameProps(...args: RestParamsOfConcatProps): Props;
function withSameProps(props: (to: Route, ...args: RestParamsOfConcatProps) => Record<string, unknown>, ...args: RestParamsOfConcatProps): Props;
function withSameProps(props: any, ...args: any): Props {
  if (typeof props !== 'function') {
    args.unshift(props);
    props = concatProps;
  }
  return to => {
    if (to.meta[SAME_PROPS] && to.meta[CURRENT_ROUTE] === to) {
      return { ...to.meta[SAME_PROPS] };
    }
    to.meta[SAME_PROPS] = props(to, ...args);
    return to.meta[SAME_PROPS];
  };
}

export { withSameProps as withProps };

/**
 * 使用同一个props，设置components
 * @param components
 * @param props
 */
export function componentsWithProps(
  components: Dictionary<Component>,
  ...args: Parameters<typeof withSameProps>
) {
  if (!components) return undefined;
  const _props = withSameProps(...args);
  return {
    components,
    props: Object.keys(components).reduce((memo, k) => {
      memo[k] = _props;
      return memo;
    }, {} as { [key in keyof typeof components]: Props }),
  };
}

export function enableBeterRouter(router: VueRouter) {
  router.beforeEach(async (to, from, next) => {
    if (to.meta[GET_PROPS]) {
      try {
        await to.meta[GET_PROPS](to);
      } catch (e) {
        next(e);
        return;
      }
    }
    if (to.matched[to.matched.length - 1].instances.default && to.meta[BEFORE_UPDATE]) {
      to.meta[BEFORE_UPDATE](to, from, next);
    } else {
      next();
    }
  });
}

export type AsyncRoutePropsFunction = (to: Route) => Record<string, unknown>;
export type BetterRouteProps = RouteConfig['props'] | AsyncRoutePropsFunction;
export type BetterRouteConfig = RouteConfig & {
  beforeUpdate?: NavigationGuard
  props?: BetterRouteProps
};

export function getProps(to: Route) {
  return to.meta[SAME_PROPS] ?? {};
}

export function defineBetterRoute(route: BetterRouteConfig): RouteConfig {
  const _props = route.props;
  const components = 'components' in route ? route.components : undefined;
  const meta = {
    ...route.meta,
  };
  const result = {
    ...route,
    meta,
    components,
  };

  if (route.beforeUpdate) {
    meta[BEFORE_UPDATE] = route.beforeUpdate;
  }

  if (typeof _props === 'function') {
    meta[GET_PROPS] = async (to: Route) => {
      to.meta[SAME_PROPS] = {
        ...await _props(to),
      };
      to.meta[CURRENT_ROUTE] = to;
    };
    if (components && Object.keys(components).length) {
      result.props = Object.keys(components).reduce((memo, k) => {
        memo[k] = getProps;
        return memo;
      }, {} as { [key in keyof typeof components]: Props });
    } else {
      result.props = getProps;
    }
  } else {
    result.props = _props;
  }
  return result;
}

declare module 'vue-router' {
  interface RouteMeta {
    [SAME_PROPS]: any,
    [CURRENT_ROUTE]: any
  }
  interface RouteConfig {
    components: RouteConfig['components'] | undefined
  }
}
