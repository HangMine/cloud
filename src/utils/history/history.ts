/* eslint-disable class-methods-use-this */
import { stringify, parse, stringifyUrl } from 'query-string';
import VueRouter, { Location } from 'vue-router';
import {
  history, location, href, replace, getCurrentIdx,
} from './jack';

const tKey = '__t';
const PARSED = Symbol('parsed');

// const relativeProtocolReg = /^\/\//;
let url: HTMLAnchorElement;

type HistoryLocation = {
  path?: string
  query?: Record<string, string | null | (null | string)[] | undefined>
  hash?: string
  domain?: string,
};

export type ComputedHistoryLocation = {
  isSameDomain: boolean,
  domain: string,
  fullPath: string,
  fullPathWithDomain: string,
} & Required<Omit<HistoryLocation, 'name'>> & { name?: string };


type RawHistoryLocation = HistoryLocation | string;

export default class History {
  router !: VueRouter;
  constructor(router?: VueRouter) {
    if (router) {
      this.router = router;
    }
  }
  useRouterToNavigate(to: ComputedHistoryLocation) {
    return to.isSameDomain;
  }

  parse(a: RawHistoryLocation) {
    const currentDomain = `${location.protocol}//${location.host}`;
    if (!url) {
      url = globalThis.document.createElement('a');
    }
    let aQuery = {};
    let aPath = '/';
    let aDomain: string | undefined;
    let aHash: string | undefined;
    if (typeof a === 'object') {
      // @ts-ignore
      if (a[PARSED]) {
        return a as ComputedHistoryLocation;
      }
      aQuery = a.query ?? aQuery;
      aPath = a.path ?? aPath;
    } else {
      aPath = a;
    }
    url.href = aPath;
    const path = url.pathname;
    const domain = aDomain ?? `${url.protocol}//${url.host}`;
    const isSameDomain = currentDomain === domain;
    const queryString = url.search.replace('?', '');
    const parsedQuery = queryString ? parse(queryString) : {};
    const query = {
      ...parsedQuery,
      ...aQuery,
    };
    const hash = aHash ?? url.hash.replace('#', '');
    url.search = `?${stringify(query)}`;
    url.hash = hash;
    const fullPath = url.pathname + url.search + url.hash;
    const fullPathWithDomain = domain + fullPath;
    return {
      [PARSED]: true,
      path,
      domain,
      isSameDomain,
      fullPath,
      query,
      fullPathWithDomain,
      hash,
    };
  }

  async push(to: RawHistoryLocation) {
    const objTo = this.parse(to);
    if (this.useRouterToNavigate(objTo)) {
      if (objTo.fullPath !== this.router.currentRoute.fullPath) {
        try {
          await this.router.push(objTo);
        } catch (e) {
          if (e !== undefined && e.name !== 'NavigationDuplicated') {
            throw e;
          }
        }
      }
    } else if (objTo.fullPathWithDomain !== stringifyUrl({ url: location.href, query: { [tKey]: undefined } })) {
      href(stringifyUrl({ url: objTo.fullPathWithDomain, query: { [tKey]: `${Date.now()}` } }));
    }
    return objTo;
  }

  get length() {
    return history.length;
  }

  get index() {
    return getCurrentIdx() || 0;
  }

  get currentRoute() {
    return this.router.currentRoute;
  }

  async replace(to: RawHistoryLocation | Location) {
    const objTo = this.parse(to);
    if (this.useRouterToNavigate(objTo)) {
      if (objTo.fullPath !== this.router.currentRoute.fullPath) {
        try {
          await this.router.replace(objTo);
        } catch (e) {
          if (e !== undefined && e.name !== 'NavigationDuplicated') {
            throw e;
          }
        }
      }
    } else if (objTo.fullPathWithDomain !== stringifyUrl({ url: location.href, query: { [tKey]: undefined } })) {
      replace(stringifyUrl({ url: objTo.fullPathWithDomain, query: { [tKey]: `${Date.now()}` } }));
    }
    return objTo;
  }

  reload(...args: Parameters<globalThis.Location['reload']>) {
    globalThis.location.reload(...args);
  }

  forward(...args: Parameters<globalThis.History['forward']>) {
    history.forward(...args);
  }

  back(...args: Parameters<globalThis.History['back']>) {
    history.back(...args);
  }
  isSameDomain(...args: Parameters<History['parse']>) {
    return this.parse(...args).isSameDomain;
  }
}
