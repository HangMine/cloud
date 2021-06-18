import { QRCodeCanvas } from '@cheprasov/qrcode';

export const url2ImageUrl = async (url: string, config?: Obj) => {
  const qrCanvas = new QRCodeCanvas(url, config);
  const dataUrl = await qrCanvas.toDataUrl() as string;
  return dataUrl;
};

export const url2Image = async (url: string, config?: Obj) => {
  const dataUrl = await url2ImageUrl(url, config);
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = dataUrl;
  return img;
};

