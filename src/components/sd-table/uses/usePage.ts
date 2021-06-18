import {
  reactive, computed, toRefs, getCurrentInstance,
} from 'vue';
import { ElPagination } from 'element-plus';
import { Obj } from '../type';
// 只是保存数据，不需要双向绑定那套重逻辑

// 前端分页需要保存初始数据，从里面切割
// eslint-disable-next-line import/no-mutable-exports
export let initRows: Obj[] = [];
// 前端分页需要保存初始数据，重新计算表头宽度
// eslint-disable-next-line import/no-mutable-exports
export let initColumns: Obj[] = [];

const defaultPageOptions = {
  total: 0,
  currentPage: 1,
  layout: 'prev, pager, next',
  currentSize: 10,
  // pageSizes: [10, 20, 30, 40, 50],
  // layout: 'total, sizes, prev, pager, next, jumper',
};

interface Params {
  type: 'back' | 'front'
  pageOptions: typeof ElPagination & { pageKey?: string, sizeKey?: string } | false
}

const usePage = ({ type, pageOptions }: Params) => {
  const that: any = getCurrentInstance()?.proxy;
  const state = reactive({
    pageOptions: { ...defaultPageOptions, ...(pageOptions || {}) },
  });

  const getPageParams = (_type: 'back' | 'front' = type) => {
    const pageKey = state.pageOptions.pageKey ?? 'page';
    const sizeKey = state.pageOptions.sizeKey ?? 'size';
    const backPageParams = {
      [pageKey]: state.pageOptions.currentPage,
      [sizeKey]: state.pageOptions.currentSize,
    };
    const noPageParams = { page: 1, size: 99999 };// 99999是为了支持服务端接口
    // eslint-disable-next-line no-nested-ternary
    return !pageOptions ? noPageParams : _type === 'back' ? backPageParams : {};
  };

  const pageParams = computed(() => getPageParams());

  // type为'front'时也获取到参数
  const frontPageOptions = computed(() => getPageParams('back'));

  // 后端分页主逻辑
  const backPageMain = () => {
    that.load();
  };

  // 获取切割后的数据
  const getSlicesRows = (_initRows = initRows) => {
    if (!pageOptions) return _initRows;
    const page = state.pageOptions.currentPage;
    const size = state.pageOptions.currentSize;
    const start = (page - 1) * size;
    const end = page * size;
    return _initRows.slice(start, end);
  };

  // 前端分页主逻辑
  const frontPageMain = (_initRows = initRows) => {
    that.currentRows = getSlicesRows(_initRows);
    that.currentColumns = that.handleColumns(initColumns);
  };

  // 分页主逻辑函数
  const pageMain = () => {
    type === 'back' ? backPageMain() : frontPageMain();
  };

  // 设置前端分页需要保存的初始数据
  const setInitData = (rows: Obj[], columns: Obj[]) => {
    initRows = rows;
    initColumns = columns;
  };

  // 分页事件
  const sizeChange = (size: number) => {
    state.pageOptions.currentSize = size;
    // elementUI会处理成最后一页，触发pageChange
    if (size * state.pageOptions.currentPage > state.pageOptions.total) return;
    pageMain();
  };

  const pageChange = (page: number) => {
    state.pageOptions.currentPage = page;
    pageMain();
  };

  // 获取前端分页的数据
  const getFrontPageRows = (rows: Obj[], columns: Obj[]) => {
    setInitData(rows, columns);
    return getSlicesRows(rows);
  };

  return {
    ...toRefs(state),
    pageParams,
    frontPageOptions,
    sizeChange,
    pageChange,
    getFrontPageRows,
  };
};

export default usePage;
