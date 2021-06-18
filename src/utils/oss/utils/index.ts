import {
  getAuthConfig,
  getDir,
  getSts, getUrlPrefix,
} from '@/loaders/dictionary';
import { getOssAuth, getParams } from '../uploader';
import signUrl, { getSignature } from './sign';
import isOssUrl, { isNeedSignOssUrl } from './is-oss-url';
import thumb from './thumb';


export { getSignature as getOssSignature };
export { getUrlPrefix };
export { getSts as sts };
export { getAuthConfig };
export { getDir };
export { getParams, getParams as getItem };
export { isOssUrl, isNeedSignOssUrl };
export { signUrl };
export { thumb };
export { getOssAuth };


// async function testSign() {
//   const _sts = await sts();
//   const signature = await getOssSignature({
//     debug: true,
//     query: {
//       'x-oss-process': generateOssCommands({
//         width: parseInt(1000 * Math.random(), 10),
//         height: parseInt(1000 * Math.random(), 10),
//       }).join('|'),
//
//     },
//     params: {
//       ..._sts,
//       key: 'furImg/1183948350463021058-e781ed2857166a13c4adcbeaab44a639.png',
//     },
//     method: 'GET',
//     headers: {},
//   });
//   return signature;
// }

// async function testTestSign(time) {
//   console.time(`test sign ${time} time`);
//   for (let i = 1; i < time; i++) {
//     // eslint-disable-next-line no-await-in-loop
//     await testSign();
//   }
//   console.timeEnd(`test sign ${time} time`);
// }
// testTestSign(1000);
