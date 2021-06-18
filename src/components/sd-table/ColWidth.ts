/*
 * 对每个表头设置wid属性
 * 每个column可传入:
 * minWid || minWidth:最小宽度
 * width:固定宽度
 * addWid:在计算的宽度上加减的宽度
 * calcWid: 任何类型，交给colWidth计算
 */
import { deepCopy, toRawType } from './utils';
import { Obj } from './type';

const defaultOptions = {
  // 意外的值宽度
  LAST_WIDTH: 100,
  // 每列最大宽度
  COL_MAX_WIDTH: 400,
  // 单字符宽度
  SIGNLE_WIDTH: 9,
  // 双字符宽度
  DOUBLE_WIDTH: 18,
  // 排序图标宽度,
  SORT_ICON_WIDTH: 10,
  // elementUI表格单元格padding(需要看table的size)
  CEIL_PADDING_WIDTH: 40,
  // 当宽度超出最大宽度时，增加该class
  WIDTH_MORE_THAN_MAX: 'wid-more-than-max',
};

class ColWidth {
  options = defaultOptions;

  constructor(cols = [], rows = [], footer = {}, options?: typeof defaultOptions) {
    if (options) this.setOptions(options);
    return this.getWidCols(cols, rows, footer);
  }
  setOptions(options: typeof defaultOptions) {
    this.options = { ...defaultOptions, ...options };
  }
  getWidCols(cols: Obj[] = [], rows: Obj[] = [], footer: Obj = {}) {
    const {
      SORT_ICON_WIDTH, CEIL_PADDING_WIDTH, COL_MAX_WIDTH, WIDTH_MORE_THAN_MAX,
    } = this.options;

    const resultColumns = deepCopy(cols);

    // 递归兼容多级表头
    const helper = (columns: Obj[], _rows: Obj[], _footer: Obj) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of columns) {
        if (item.children) {
          helper(item.children, _rows, _footer);
        } else {
          // eslint-disable-next-line no-continue
          if (item.minWid || item.wid) continue;
          const headerWid = this.getLength(item.title) + SORT_ICON_WIDTH;
          const contentWid = item.calcWid ? this.getLength(item.calcWid) : this.getContentMaxWidth(_rows, item.key);
          const footerWid = this.getFooterMaxWidth(_footer, item.key);
          const addWid = item.addWid || 0;
          const calcWid = Math.max(headerWid, contentWid, footerWid) + CEIL_PADDING_WIDTH + addWid; // addWid为自定义需要要增加的宽度
          if (calcWid > COL_MAX_WIDTH) {
            item.className = WIDTH_MORE_THAN_MAX;
          }
          item.minWid = Math.min(calcWid, COL_MAX_WIDTH);
        }
      }
    };

    helper(resultColumns, rows, footer);
    return resultColumns;
  }
  getContentMaxWidth(rows: Obj[], col: string) {
    if (!rows || !rows.length) {
      return 0;
    }
    const lengthArr = rows.map(item => this.getLength(item[col]));
    const maxLength = Math.max(...lengthArr);
    return maxLength;
  }
  getFooterMaxWidth(footer: Obj, col: string) {
    return footer && Object.keys(footer).length ? this.getLength(footer[col]) : 0;
  }

  getLength(val: any): number {
    const { SIGNLE_WIDTH, LAST_WIDTH } = this.options;
    switch (toRawType(val)) {
      case 'Number':
        return Math.round(`${val}`.length * SIGNLE_WIDTH);
      case 'String':
        return this.handleString(val);
      case 'Object':
        if (!val || val.name === 0) return 0; // 值为null或者'0'时
        if (val.name) {
          return this.handleString(`${val.name}`);
        }
        return LAST_WIDTH;
      case 'Array':
        return this.getArrayLength(val);
      default:
        return val ? LAST_WIDTH : 0; // 固定宽度100，值为falsy则为0
    }
  }
  // 获取数组长度，在这里递归
  getArrayLength(arr = []) {
    const lengths = arr.map(item => this.getLength(item));
    return Math.max(...lengths);
  }
  // eslint-disable-next-line class-methods-use-this
  handleString(val: string) {
    const { SIGNLE_WIDTH, DOUBLE_WIDTH } = this.options;
    // eslint-disable-next-line no-control-regex
    const matchs = val.match(/[^\x00-\xff]/g);
    const doubleLength = (matchs && matchs.length) || 0;
    const singleLength = val.length - doubleLength;
    return doubleLength * DOUBLE_WIDTH + Math.round(singleLength * SIGNLE_WIDTH);
  }
}

export default ColWidth;
