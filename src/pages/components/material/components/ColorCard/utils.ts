/* eslint-disable import/prefer-default-export */
import keys from '_/keys';


export const getDefaultColor = () => ({
  value: 'rgb(0,0,0)',
  name: '未命名',
  temName: '未命名',
  isEdit: false,
  isDefault: false,
  system: '黑色',
  fileInfo: {
    '4ddat': '',
  },
});
type DefaultColor = ReturnType<typeof getDefaultColor>;
export interface Color extends DefaultColor {
  materialFile?: File // 前端使用
  isBindMaterialFile?: boolean // 是否绑定了第一步上传的材料文件
  imgInfo?: Obj
  renderingInfo?: Obj
  isUnfindColor?: boolean // 4ddat没找到色卡
}
export type Colors = Color[];

export const getColorSystemPrevious = (color: string) => {
  const reg = /rgb(a?)\((.*)\)/;
  const match = color.match(reg);
  const rgbStr = match?.[2] || '0,0,0';
  const rgb = rgbStr.replace(/\s/g, '').split(',').map(item => +item);
  const systemMap = {
    红色: [255, 0, 0],
    橙色: [255, 127, 255],
    黄色: [255, 255, 0],
    绿色: [0, 255, 0],
    青色: [0, 255, 255],
    蓝色: [0, 0, 255],
    紫色: [255, 0, 255],
    黑色: [0, 0, 0],
    白色: [255, 255, 255],
    灰色: [127, 127, 127],
    棕色: [127, 64, 0],
    粉色: [255, 127, 127],
    米色: [194, 160, 127],
  };
  const absoluteMap = keys(systemMap).reduce((obj, key) => {
    const rgbArr = systemMap[key];
    const _absolute = rgb.reduce((total, cur, i) => {
      const absolute = Math.abs(cur - rgbArr[i]);
      total += absolute;
      return total;
    }, 0);
    obj[_absolute] = key;
    return obj;
  }, {} as Record<number, keyof typeof systemMap>);
  const minAbsolute = Math.min(...Object.keys(absoluteMap).map(item => +item));
  const colorSystem = absoluteMap[minAbsolute];
  return colorSystem;
};


const rgbToHsv = (rgb: number[]): number[] => {
  let [r, g, b] = rgb;
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, v * 100];
};

const getColorFromHsv = (hsv: number[]): string => {
  const [h, s, v] = hsv;
  if (v <= 20) return '黑色';
  if (s <= 17) {
    if (v <= 90) return '灰色';
    return '白色';
  }
  if (h <= 30 || h >= 330) return '红色';
  if (h <= 45) return '橙色';
  if (h <= 90) return '黄色';
  if (h <= 150) return '绿色';
  if (h <= 210) return '青色';
  if (h <= 270) return '蓝色';
  return '紫色';
};

export const colorSystems = ['黑色', '灰色', '白色', '红色', '橙色', '黄色', '绿色', '青色', '蓝色', '紫色'];
export const getColorSystem = (color: string): string => {
  const reg = /rgb(a?)\((.*)\)/;
  const match = color.match(reg);
  const rgbStr = match?.[2] || '0,0,0';
  let rgb = rgbStr.replace(/\s/g, '').split(',').map(item => +item);
  if (!(rgb instanceof Array) || rgb.length < 3) { return '黑色'; }
  rgb = rgb.slice(0, 3);
  console.log(rgb);

  const hsv = rgbToHsv(rgb);
  console.log(hsv);
  const colorName = getColorFromHsv(hsv);
  console.log(colorName);
  return colorName;
};
