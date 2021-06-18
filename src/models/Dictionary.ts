export type DictOption = { usName: string, name: string, value: any };

/**
 * 由bff-center/showCommon/getDictionaryTypeItem返回的字典数据，与DictOption类似
 * http://yapi.4dshoetech.local/project/115/interface/api/6104
 */
export type DictItem = {
  label: string, flag: number, itemCode: string, itemValue: any,
  sort: number, typeCode: string, language: string
};


// function normalizeDicItem(item: DictOption | DictItem, lang = 'cn') {
//   const {
//     label, itemValue, usName, name,
//   } = item;

//   let _label = label ?? lang === 'cn' ? name : usName;
//   return {
//     usName: string, name: string, value: any,

//   };
// }
