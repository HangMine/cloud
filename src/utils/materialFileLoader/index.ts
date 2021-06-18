/* eslint-disable*/
import getDiffuseColorFrom4Ddat from './_4DdatHelper';

type AseColorItem = {
  color: [number, number, number],
  name: string
};

type AseColor = {
  colors: AseColorItem[],
  groups: unknown[],
  version: number[]
};

export const parseMaterialFile = async (file: File): Promise<[number, number, number]> => {
  return new Promise((resolve, reject) => {
    const callback = ({ code, message }: { code: number, message: string }, rgbArr: [number, number, number]) => {
      if (code !== 0) {
        const error = new Error(`解析面料文件错误:${message || '未知错误'}`) as Error & { isUnfindColor: boolean };
        if ([-1, -1000].includes(code)) error.isUnfindColor = true;
        reject(error);
      } else {
        // 统一为整数(CSS规范：https://www.w3school.com.cn/cssref/css_colors_legal.asp)
        let resArr = rgbArr.map((number: number) => { return Math.round(number) }) as [number, number, number];
        resolve(resArr);
      }
    };
    getDiffuseColorFrom4Ddat(file, callback);
  });
};

export default parseMaterialFile;
