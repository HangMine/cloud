import {
  reactive, computed, toRefs, getCurrentInstance,
} from 'vue';
import { Obj } from '../type';

import { initRows } from './usePage';

type SortTypes = 'string' | 'int' | 'percent' | 'date' | 'week';

type OrderTypes = 'ascending' | 'decending';

type Target = string | number | { name: string, [otherKey: string]: any };

function getValue(target: string): string;
function getValue(target: number): number;
function getValue(target: { name: string, [otherKey: string]: any }): string | number;
function getValue(target: Target) {
  if (typeof target === 'object') {
    return target.name;
  }
  return target;
}

const getNumber = (row: Obj, key: string) => {
  const val = `${getValue(row[key])}`;
  return +val.replace(/[^\d.]/g, '');
};

const getDate = (row: Obj, key: string) => {
  let val = `${getValue(row[key])}`;
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(+val)) {
    if (val === '--') return new Date(0); // 兼容'--'的情况
    val = val.replace(/-/g, '/');
    return new Date(val);
  }
  return +val;
};

const getWeek = (row: Obj, key: string) => {
  let val = getValue(row[key]);
  val = val.replace(/[\u4e00-\u9fa5]/g, '').replace(/-/g, ''); // 去除中文和-
  return +val;
};

const sortString = (currentRows: Obj[], key: string, order: OrderTypes) => {
  currentRows.sort((a, b) => {
    const v1 = (a[key] && a[key].name && `${a[key].name}`) || `${a[key]}` || '';
    const v2 = (b[key] && b[key].name && `${b[key].name}`) || `${b[key]}` || '';
    const asc = v1.localeCompare(v2, 'zh-Hans-CN', {
      sensitivity: 'accent',
    });
    const desc = v2.localeCompare(v1, 'zh-Hans-CN', {
      sensitivity: 'accent',
    });
    return order === 'ascending' ? asc : desc;
  });
};

const sortInt = (currentRows: Obj[], key: string, order: OrderTypes) => {
  currentRows.sort((a, b) => {
    const v1 = `${(a[key] && a[key].name) || a[key]}`;
    const v2 = `${(b[key] && b[key].name) || b[key]}`;
    v1.replace('--', '0').replace(/\(.+\)/, '');
    v2.replace('--', '0').replace(/\(.+\)/, '');
    return order === 'ascending' ? +v1 - +v2 : +v2 - +v1;
  });
};

const sortPercent = (currentRows: Obj[], key: string, order: OrderTypes) => {
  currentRows.sort((a, b) => {
    const v1 = `${(a[key] && a[key].name) || a[key]}`;
    const v2 = `${(b[key] && b[key].name) || b[key]}`;
    v1
      .replace('%', '')
      .replace('--', '0')
      .replace(/\(.+\)/, '');
    v2
      .replace('%', '')
      .replace('--', '0')
      .replace(/\(.+\)/, '');
    return order === 'ascending' ? +v1 - +v2 : +v2 - +v1;
  });
};

const sortDate = (currentRows: Obj[], key: string, order: OrderTypes) => {
  currentRows.sort((a, b) => {
    const v1 = getDate(a, key);
    const v2 = getDate(b, key);
    return order === 'ascending' ? +v1 - +v2 : +v2 - +v1;
  });
};

const sortWeek = (currentRows: Obj[], key: string, order: OrderTypes) => {
  currentRows.sort((a, b) => {
    const v1 = getWeek(a, key);
    const v2 = getWeek(b, key);
    return order === 'ascending' ? v1 - v2 : v2 - v1;
  });
};

const getSortFn = (type: SortTypes) => {
  switch (type) {
    case 'string':
    default:
      return sortString;
    case 'int':
      return sortInt;
    case 'percent':
      return sortPercent;
    case 'date':
      return sortDate;
    case 'week':
      return sortWeek;
  }
};

const useSort = (pageType: 'front' | 'back') => {
  const that: any = getCurrentInstance();

  const state = reactive({
    sortType: '' as SortTypes,
    sortKey: '', // 列
    sortOrder: '' as OrderTypes,
  });

  const sortParams = computed(() => {
    if (pageType === 'front' || !state.sortOrder) return {};
    return {
      sortKey: state.sortKey,
      sortOrder: state.sortOrder,
    };
  });

  const getHeader = (key: string) => {
    const columns = that.currentColumns.flat();
    const column = columns.find((item: Obj) => item.key === key);
    return column;
  };

  // 后端排序
  const backSort = () => {
    that.load ? that.load() : that.$parent.load();
  };

  // 前端排序
  const frontSort = () => {
    const header = getHeader(state.sortKey);
    if (!header) return; // 兼容切换表头时找不到数据的报错
    state.sortType = header.sort;
    const sortFn = getSortFn(state.sortType);
    // 正常排序
    const _initRows = [...initRows];
    sortFn(_initRows, state.sortKey, state.sortOrder);
    that.frontPageMain(_initRows);
  };

  // 排序
  const sortChange = (column: { prop: string, order: OrderTypes }) => {
    state.sortKey = column.prop;
    state.sortOrder = column.order;
    if (!column.order) {
      // 不排序时回复原来排序
      that.resetRows();
      return;
    }
    that.type === 'back' ? backSort() : frontSort();
  };

  return {
    ...toRefs(state),
    sortParams,
    sortChange,
  };
};

export default useSort;
