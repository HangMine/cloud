/* eslint-disable max-len */
import filterThumb from '@/filters/thumb';
import { EnclosureItem } from '@/models/Material';
import AppError from '@/utils/error';
import { getRelativePathFromUrl } from '@/utils/normalize-component';
import uploadToOSS from '@/utils/oss/uploadToOSS';

export type UploadItem = {
  item: File | string,
  url: string, // 前端保证能展示的URL,管道地址|ObjectUrl
  name: string
};
export type UploadItems = UploadItem[];
export type FailUploadItem = {
  name: string,
  type: 'img' | 'video' | 'file' | '4ddat'
};
export type FailUploadList = FailUploadItem[];
type FilesList = (File[])[];

export type onUploadCallback = (event: unknown, fileLoaded: number, fileSize: number, process: number, options: any) => any;
// export const uploadItem2FrontEnclosureItem = (uploadItem: UploadItem) => {
//   const enclosureItem: EnclosureItem = {
//     url: '',
//     name: uploadItem.name,
//   };
//   if (uploadItem.item instanceof File) {
//     enclosureItem.url = URL.createObjectURL(uploadItem.item);
//   }
//   // else {
//   //   enclosureItem.url = filterThumb(uploadItem.item, { width: 128, height: 128 } as any) as string;
//   // }
//   return enclosureItem;
// };

// export const upladItems2FrontEnclosureItems = (uploadItems: UploadItems): EnclosureItem[] => {
//   return uploadItems.map(uploadItem => {
//     return uploadItem2FrontEnclosureItem(uploadItem);
//   });
// };

const file2Osskey = async (file: File, ossPath: string, fileType: FailUploadItem['type'], onUpload?: onUploadCallback) => {
  try {
    const key = await uploadToOSS(file, ossPath, onUpload);
    return key;
  } catch (error) {
    const failUploadItem = {
      name: file.name,
      type: fileType,
    };
    throw failUploadItem;
  }
};

export const uploadItem2ApiEnclosureItem = async (uploadItem: UploadItem, ossPath: string, fileType: FailUploadItem['type'] = 'file', onUpload?: onUploadCallback): Promise<EnclosureItem> => {
  const enclosureItem: EnclosureItem = {
    url: '',
    name: uploadItem.name,
  };
  if (uploadItem.item instanceof File) {
    enclosureItem.url = await file2Osskey(uploadItem.item, ossPath, fileType, onUpload);
  } else {
    enclosureItem.url = getRelativePathFromUrl(uploadItem.item);
  }
  return enclosureItem;
};

export const uploadItem2ApiEnclosureItems = async (uploadItems: UploadItems, ossPath: string, fileType: FailUploadItem['type'] = 'file', onUpload?: onUploadCallback): Promise<EnclosureItem[]> => {
  const failList: FailUploadList = [];
  const apiEnclousureItems = await Promise.all(uploadItems.map(async uploadItem => {
    return uploadItem2ApiEnclosureItem(uploadItem, ossPath, fileType, onUpload).catch((failUploadItem: FailUploadItem) => {
      failList.push(failUploadItem);
    });
  })).catch(() => {
    throw failList;
  });
  return apiEnclousureItems as EnclosureItem[];
};

export const apiEnclosureItems2UploadItems = (apiEnclosureItems: EnclosureItem[]): UploadItems => {
  return apiEnclosureItems.map(enclosureItem => ({
    item: enclosureItem.url,
    url: enclosureItem.url,
    name: enclosureItem.name,
  }));
};


const file2promise = async (item: any, path: string): Promise<File & { _webkitRelativePath: string }> => {
  return new Promise((resolve) => {
    item.file((file: File & { _webkitRelativePath: string }) => {
      file._webkitRelativePath = `${path}${file.name}`;
      resolve(file);
    });
  });
};

const directory2promise = async (item: any): Promise<any[]> => {
  return new Promise((resolve) => {
    const dirReader = item.createReader();
    dirReader.readEntries((items: any) => {
      resolve(items);
    });
  });
};

const getItemPromises = async (_item: any, _path = '') => {
  const itemPromises: Promise<File>[] = [];
  const loop = async (item: any, path = '') => {
    if (item.isFile) {
      itemPromises.push(file2promise(item, path));
    } else if (item.isDirectory) {
      const items = await directory2promise(item);
      // for循环的await为继发
      for (let i = 0; i < items.length; i++) {
        await loop(items[i], `${path + item.name}/`);
      }
    }
  };
  await loop(_item, _path);
  return itemPromises;
};

// Thumbs.db: https://baike.baidu.com/item/Thumbs.db/5099306?fr=aladdin
const abandonFileName = (file: File) => ['Thumbs.db'].includes(file.name);

export const getDragFiles = async (e: DragEvent) => {
  const items = e.dataTransfer?.items;
  if (!items || [...items].some(item => item.kind !== 'file')) {
    throw AppError.abort;
  }

  // const filesList = await getFileOrDierctoryItems(items);
  // 并发执行await
  const itemPromisesList = await Promise.all([...items].map(async _item => {
    const item = _item.webkitGetAsEntry();
    const itemPromises = await getItemPromises(item);
    return itemPromises;
  }));

  const filesList: FilesList = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const itemPromises of itemPromisesList) {
    filesList.push(await Promise.all(itemPromises));
  }
  const flatFiles: File[] = filesList.flat().filter(file => !abandonFileName(file));
  return flatFiles;
};
