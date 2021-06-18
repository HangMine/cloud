// 通过 require.context 获取不到类型
// import { Obj } from '../type';

// const ctx = require.context('./', false, /(?<!(index)).ts$/);

// const uses = ctx.keys().reduce((obj:Obj, path) => {
//   const matches = path.match(/\.\/(.*)\./);
//   const fileName = matches?.[1] || '';
//   obj[fileName] = ctx(path).default;
//   return obj;
// }, {});

// export default uses;

import useCellClick from './useCellClick';
import useEditModal from './useEditModal';
import useExport from './useExport';
import useFormCheck from './useFormCheck';
import useMaxHeight from './useMaxHeight';
import usePage from './usePage';
import useSelection from './useSelection';
import useSort from './useSort';
import useQuery from './useQuery';

export default {
  useCellClick, useEditModal, useExport, useFormCheck, useMaxHeight, usePage, useSelection, useSort, useQuery,
};
