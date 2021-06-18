/* eslint-disable import/prefer-default-export */
import {
  UploadItems, uploadItem2ApiEnclosureItems, FailUploadItem, FailUploadList, onUploadCallback,
} from '@/components/form/upload/utils';
import { EnclosureItem, MaterialDetail, MaterialListItem } from '@/models/Material';
import deepCopy, { getType } from '@/utils/deep-copy';
import { getRelativePathFromUrl } from '@/utils/normalize-component';
import uploadToOSS from '@/utils/oss/uploadToOSS';
import axios, { AxiosResponse } from 'axios';
import { Ref, ref } from 'vue';
import * as materialApi from '@/api/material';
import AppError from '@/utils/error';
import tryParseJson from '@4dst-saas/public-utils/dist/try-parse-json';
import { getContextUser } from '@/loaders/context';
import { getAuthConfig } from '@/loaders/dictionary';
import parseMaterialFile from '@/utils/materialFileLoader';
import {
  Color, Colors, getDefaultColor, getColorSystem,
} from './components/ColorCard/utils';

export const loading = ref(false);
export const uploadedPercentage = ref('');
export const failList: FailUploadList = [];

export const getUploadSizeStat = (fileForm: string | File | UploadItems | { [key: string]: undefined | File | any }) => {
  const fileMap = {} as { [id: string]: number };
  let totalSize = 0;
  return {
    getTotalSize(files = fileForm) {
      // if (typeof files === 'string') {
      //   return;
      // }
      console.log(files);
      if (files instanceof File) {
        totalSize += files.size;
      } else if (Array.isArray(files)) {
        files.forEach((file) => {
          if (file.item) {
            this.getTotalSize(file.item);
          }
        });
      } else if (typeof files === 'object' && files) {
        Object.values(files).forEach(file => {
          if (file) {
            this.getTotalSize(file);
          }
        });
      }
      console.log(totalSize);
      // return totalSize;
    },
    addUploadedSize(uploadChunkStat: Parameters<onUploadCallback>) {
      console.log(uploadChunkStat);
      const { fileId } = uploadChunkStat[4];
      // if (!fileMap[uploadId]) {
      //   fileMap[uploadId] = 0;
      // }
      fileMap[fileId] = uploadChunkStat[1] || 0;
      this.getUploadedPercentage();
    },
    getTotalUploadedChunkSize() {
      console.log(fileMap, Object.values(fileMap));
      return Object.getOwnPropertySymbols(fileMap).reduce((sum, sblKey) => {
        // @ts-ignore
        return sum + fileMap[sblKey];
      }, 0);
    },
    getUploadedPercentage() {
      const uploadedChunkSize = this.getTotalUploadedChunkSize();
      console.log(uploadedChunkSize);
      uploadedPercentage.value = `${(uploadedChunkSize / totalSize * 100).toFixed(2)}%`;
      // return uploadedPercentage.value;
    },
  };
};

export const getEnclosureInfo = async (fileForm: {
  materialEnclosureItem?: EnclosureItem, imgList: UploadItems, videoList: UploadItems, fileList: UploadItems
}, onUpload?: onUploadCallback) => {
  const {
    imgList, videoList, fileList,
  } = fileForm;
  const uploadOssKeys = {
    images: [] as EnclosureItem[],
    videos: [] as EnclosureItem[],
    docs: [] as EnclosureItem[],
  };


  if (imgList.length) {
    try {
      uploadOssKeys.images = await uploadItem2ApiEnclosureItems(imgList, 'BINARY_FILE', 'img', onUpload);
    } catch (_failList) {
      failList.push(..._failList as FailUploadList);
    }
  }
  if (videoList.length) {
    try {
      uploadOssKeys.videos = await uploadItem2ApiEnclosureItems(videoList, 'BINARY_FILE', 'video', onUpload);
    } catch (_failList) {
      failList.push(..._failList as FailUploadList);
    }
  }
  if (fileList.length) {
    try {
      uploadOssKeys.docs = await uploadItem2ApiEnclosureItems(fileList, 'BINARY_FILE', 'file', onUpload);
    } catch (_failList) {
      failList.push(..._failList as FailUploadList);
    }
  }

  return uploadOssKeys;
};

type GetRenderingInfoParams = {
  colorInfos: Colors,
  onUpload?: onUploadCallback,
  materialEnclosureItem?: { url: string, name: string },
  onParseStart?: () => void,
  onParseEnd?: () => void
};
export const getRenderingInfo = async ({
  colorInfos, onUpload, materialEnclosureItem, onParseStart, onParseEnd,
}: GetRenderingInfoParams) => {
  const bindSddatColor = colorInfos.find(item => item.isBindMaterialFile && item.materialFile);
  let sddatKey = materialEnclosureItem ? materialEnclosureItem.url : '';
  const firstColor = colorInfos[0];
  let parse4ddatRes = (firstColor ? {
    imgInfo: {},
    renderingInfo: firstColor.renderingInfo,
  } : {} as Obj) as AsyncReturnType<typeof materialApi.parse4ddat>;
  if (bindSddatColor && bindSddatColor.materialFile) {
    // try {
    //   sddatKey = await uploadToOSS(bindSddatColor.materialFile, '4DDAT', onUpload);
    // } catch (error) {
    //   failList.push({
    //     name: bindSddatColor!.materialFile!.name,
    //     type: '4ddat',
    //   });
    // }
    if (onParseStart) onParseStart();
    const getRg = async () => {
      const { cfgs, ossSTS } = await getAuthConfig();
      const { region, defaultRegion } = cfgs;
      return ossSTS[region].region || ossSTS[defaultRegion].region || '';
    };
    parse4ddatRes = await materialApi.parse4ddat({
      sddatName: bindSddatColor.materialFile.name,
      sddatFile: bindSddatColor.materialFile,
      rg: await getRg(),
      companyId: getContextUser()?.companyId || '',
    });
    parse4ddatRes.renderingInfo = tryParseJson(parse4ddatRes.renderingInfo);
    sddatKey = parse4ddatRes['4DDATPath'];
    if (onParseEnd) onParseEnd();
  }

  const renderingInfo = colorInfos.filter(item => !item.isUnfindColor).map((item, i) => {
    item.fileInfo['4ddat'] = getRelativePathFromUrl(item.fileInfo['4ddat'] || sddatKey); // 设置4ddat的key值
    const newImgInfo: Obj = { ...item.imgInfo, ...parse4ddatRes.imgInfo };
    Object.entries(newImgInfo).forEach(([key, value]) => {
      newImgInfo[key] = getRelativePathFromUrl(value);
    });
    const newRenderingInfo = item?.renderingInfo ? item.renderingInfo : parse4ddatRes.renderingInfo;
    return {
      sort: i,
      name: item.name,
      colorInfo: item.value,
      isDefault: item.isDefault ? 1 : 0,
      colorFamily: item.system,
      fileInfo: item.fileInfo,
      isBan: item.isBindMaterialFile ? 1 : 0,
      imgInfo: newImgInfo,
      renderingInfo: newRenderingInfo,
    };
  });


  return renderingInfo;
};


export const addColor = (refColors: Ref<Colors>, color: Color, isUnshfit?: Boolean) => {
  const add = () => {
    if (isUnshfit) {
      refColors.value.unshift(color);
    } else {
      refColors.value.push(color);
    }
  };
  if (refColors.value.length === 0) {
    add();
    return;
  }
  const firstColor = refColors.value[0];
  const { renderingInfo, imgInfo = {} } = firstColor;
  const parse4ddatImgInfo = Object.entries(imgInfo).reduce((obj, [key, value]) => {
    if (/.PNG$/.test(key)) {
      obj[key] = getRelativePathFromUrl(value);
    }
    return obj;
  }, {} as Obj);
  color.renderingInfo = renderingInfo;
  color.imgInfo = parse4ddatImgInfo;
  add();
};

export const handle4ddatChage = async (materialFile: File | undefined, refColorInfos: Ref<Colors>) => {
  const clear4ddat = () => {
    refColorInfos.value.forEach(item => {
      item.fileInfo['4ddat'] = '';
    });
  };
  if (materialFile) {
    // 新增4ddat或者编辑4ddat
    let isUnfindColor = false;
    let rgbArr = [] as unknown as [number, number, number];
    try {
      rgbArr = await parseMaterialFile(materialFile);
    } catch (error) {
      if (error.isUnfindColor) {
        // 没有找到色卡信息特殊处理,
        isUnfindColor = true;
      }
    }
    const value = isUnfindColor ? '' : `rgb(${rgbArr.join()})`;
    const system = isUnfindColor ? '' : getColorSystem(value);
    const name = materialFile.name.slice(0, 32);
    const sddatColor: Color = {
      ...getDefaultColor(),
      value,
      name,
      temName: name,
      system,
      isBindMaterialFile: true,
      materialFile,
      isUnfindColor,
    };
    if (refColorInfos.value?.[0]?.isBindMaterialFile) {
      refColorInfos.value.shift();
    }
    addColor(refColorInfos, sddatColor);
    // refColorInfos.value.unshift(sddatColor);
  } else if (refColorInfos.value?.[0]?.isBindMaterialFile) {
    // 清除4ddat
    refColorInfos.value.shift();
  }
  clear4ddat();
};

async function getFileSize(url: string) {
  const res: AxiosResponse = await axios.head(url, {
    withCredentials: true,
  });
  const size = Number(res.headers['content-length']);
  return size;
}

export const validateFiles = async (files: File[], existedItems: UploadItems) => {
  const _files: File[] = [...files];
  const urls: string[] = [];
  existedItems.forEach(uploadItem => {
    if (uploadItem.item instanceof File) {
      _files.push(uploadItem.item);
    } else {
      urls.push(uploadItem.item);
    }
  });
  const allFileSize = _files.reduce((total, file) => total + file.size, 0);
  const allUrlSizes = await Promise.all(urls.map(async url => {
    const dataPipeUrl = `/datapipe/repository/${getRelativePathFromUrl(url)}`; // 静明接口
    const size = await getFileSize(dataPipeUrl);
    return size;
  }));
  const allUrlSize = allUrlSizes.reduce((total, size) => total + size, 0);
  if (allFileSize + allUrlSize > 1024 * 1024 * 1024) {
    throw new Error('文件总大小超过1G,请重新上传');
  }
};

// 获取图片逻辑
export const getMaterialImg = (row: MaterialListItem, imgUrlKey = 'imgUrl_crease') => {
  const { renderingInfo, images = [] } = row;
  const diaplayImgItem = renderingInfo.find(item => item.isDefault) || renderingInfo[0] || { imgInfo: { [imgUrlKey]: '' } };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const DEFAULT_IMG = require('@/assets/img/public/default-image.png');
  let displayImg = DEFAULT_IMG;
  if (diaplayImgItem.imgInfo) {
    const cloudImg = diaplayImgItem.imgInfo?.[imgUrlKey];
    const enclousureImg = images[0]; //  如果没有渲染图片,显示附件缩略图第一个
    displayImg = cloudImg || enclousureImg || DEFAULT_IMG;
  }
  return displayImg;
};
