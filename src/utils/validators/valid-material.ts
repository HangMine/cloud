/* 用于校验上传图片的尺寸和DPI是否符合上传材质的规范 */
import i18n from 'i18next';
import getDpi from '@/utils/get-dpi';
import loadImage from '@/utils/load-image';

export async function validMaterial(file: Blob, { dpi: targetDpi = 300 } = { dpi: 300 }) {
  const dpi = await getDpi(file);
  if (dpi && dpi >= targetDpi) {
    return;
  }
  const image = await loadImage(URL.createObjectURL(file));
  if (image.naturalHeight >= 1024 && image.naturalWidth >= 1024) {
    return;
  }
  throw new Error(i18n.t('validator.img_should_exceed'));
}

export default validMaterial;
