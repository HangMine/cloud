// import validWhitespace from './valid-white-space';
// import isFilled from './valid-filled';
// import strLength from './str-length';

// const defaults = {
//   max: 2,
// };
// 非负两位小数
function validPrice(price: string, message = '金额格式不正确') {
  console.info(price);
  if (price === '0') return;
  if (!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(price.toString())) {
    throw new Error(message);
  }
}

export default validPrice;
