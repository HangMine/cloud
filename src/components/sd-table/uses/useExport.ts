/* eslint-disable no-restricted-syntax */
import {
  computed, getCurrentInstance, reactive, toRefs,
} from 'vue';
import qs from 'query-string';

type Obj = { [key in string | number]: any };

type ExportOptions = {
  url: string,
  text: string,
  name: string,
  size: string,
  data: string,
  getExportData: () => string
} | false;

interface ExportData {
  formParams: Obj,
  params: Obj,
  columns: Obj[],
  rows: Obj[],
  footer: Obj
}

const useExport = (pageType: 'back' | 'front' = 'back', exportOptions: ExportOptions = false, {
  formParams = {}, params = {}, columns = [], rows = [], footer = {},
}: ExportData) => {
  const state = reactive({
    exportStr: '',
    exportUrl: computed(() => {
      if (pageType === 'front') return '';
      const baseUrl = (exportOptions && exportOptions.url) || '';
      const backExportUrl = `${baseUrl}?${qs.stringify({ ...formParams, ...params, action: 'export' })}`;
      return backExportUrl;
    }),
  });
  const getExportData = () => {
    // 普通表头数组
    const keys: string[] = [];
    // 固定表头数组
    const fixKeys: string[] = [];
    const getHeader = () => {
      const titles: string[] = [];
      const fixTitles: string[] = [];

      const helper = (arr: Obj[], prevItems: Obj[] = []) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of arr) {
          if (item.children && item.children.length) {
            helper(item.children, [...prevItems, item]);
          } else {
            const title = [...prevItems, item].map(_item => _item.title).join('-');
            const targetTitles = item.fixed ? fixTitles : titles;
            const targetKeys = item.fixed ? fixKeys : keys;
            targetTitles.push(title);
            targetKeys.push(item.key);
          }
        }
      };

      helper(columns);

      const titlesStr = `${[...fixTitles, ...titles].join()}\n`;
      return titlesStr;
    };
    const getRows = () => {
      const rowsArr: string[] = [];
      for (const item of rows) {
        const rowArr = [];
        for (const key of [...fixKeys, ...keys]) {
          const val = item[key] ?? '';
          const objVal = (val && val.title) ?? '';
          let resVal = objVal ?? val;
          if (+resVal && resVal.length > 11) resVal = `\t${resVal}`; // 超过11位的数字不显示计数法
          resVal = `${resVal}`.replace(/,/g, '-'); // ','是csv格式，需修改为'-'

          rowArr.push(resVal);
        }
        rowsArr.push(`${rowArr.join()}\n`);
      }
      const rowsStr = rowsArr.join('');
      return rowsStr;
    };
    const getFooter = () => {
      const footerArr = Object.values(footer);
      const footerStr = footerArr ? `${footerArr.join()}\n` : '';
      return footerStr;
    };

    return getHeader() + getRows() + getFooter();
  };
  return {
    ...toRefs(state),
    getExportData,
  };
};

export default useExport;
