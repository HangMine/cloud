import { parse } from 'query-string';
import { A } from 'ts-toolbelt';
import first from '_/first';

const INDEX_KEY = '__index__';
const QS_INDEX_KEY = `__history${INDEX_KEY}`;
const { history, location, document } = globalThis;
const oldPushState = history.pushState;

const indexs = {} as Record<A.Key, number>;

function getCurrentIdx() {
  let index: number | undefined;
  const key = history.state ? history.state.key : undefined;
  if (key) {
    index = indexs[key];
  }
  if (typeof index === 'undefined' && location.search) {
    const indexFromSearch = parse(location.search.substr(1))[QS_INDEX_KEY];
    if (indexFromSearch) {
      index = parseInt(first(indexFromSearch), 10);
    }
  }
  return index;
}


history.pushState = function pushState(s, ...args) {
  const index = getCurrentIdx() || 0;
  indexs[s.key] = index + 1;
  return oldPushState.call(this, s, ...args);
};

function appendIndex(url: string, index ?: number) {
  if (index === undefined) {
    return url;
  }
  let sep = '?';
  if (url.includes('?')) {
    sep = '&';
  }
  url = `${url}${sep}${QS_INDEX_KEY}=${index + 1}`;
  return url;
}

function href(url: string) {
  const index = getCurrentIdx();
  const a = document.createElement('a');
  a.href = url;
  if (a.href !== location.href) {
    location.href = appendIndex(url, index);
  }
}
function replace(url: string) {
  const index = getCurrentIdx();
  location.replace(appendIndex(url, index));
}
export {
  href, location, history, replace, getCurrentIdx,
};
