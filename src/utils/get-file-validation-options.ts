import { O } from 'ts-toolbelt';
import keys from '_/keys';

export type TypeValidationOption = {
  title?: string
  extensions?: string[]
  sizeLimit?: number
  mimeTypes?: string[]
};
export type TypeValidationOptionWithType = O.MergeUp<Partial<TypeValidationOption>, { type: string }>;
export type TypeValidationOptionMap = {
  [k: string]: TypeValidationOption
};
export const allowMap: TypeValidationOptionMap = {
  img: {
    title: '图片文件',
    extensions: ['jpg', 'jpeg', 'jfif', 'bmp', 'png', 'svg', 'svgz'],
    // 18mb
    sizeLimit: 2 * 1024 * 1024,
    // mimeTypes: [
    //   'image/jpg',
    //   'image/jpeg',
    //   'image/bmp',
    //   'image/png',
    // ],
  },
  gif: {
    title: 'GIF动画',
    extensions: ['gif'],
    sizeLimit: 2 * 1024 * 1024,
    // mimeTypes: [
    //   'image/gif',
    // ],
  },
  video: {
    title: '视频文件',
    extensions: ['mp4'],
    sizeLimit: 25 * 1024 * 1024,
    // mimeTypes: [
    //   'video/mp4',
    // ],
  },
  audio: {
    title: '音频文件',
    extensions: ['mp3'],
    sizeLimit: 25 * 1024 * 1024,
    // mimeTypes: [],
  },
  compressed: {
    title: '压缩包',
    extensions: ['zip', '7zip', 'rar'],
    sizeLimit: 500 * 1024 * 1024,
    // mimeTypes: [
    //   'application/x-rar-compressed',
    //   'application/octet-stream',
    //   'application/zip',
    //   'application/x-7z-compressed',
    // ],
  },

  ai: {
    title: 'ai文件',
    extensions: ['ai'],
    // 10mb
    sizeLimit: 500 * 1024 * 1024,
    // mimeTypes: [],
  },
  ps: {
    title: 'ps文件',
    extensions: ['psd'],
    sizeLimit: 500 * 1024 * 1024,
    // mimeTypes: [],
  },

  // autocad: {
  //   title: 'auto CAD 文档',
  //   extensions: ['dwg', 'dxf', 'dwf'],
  //   // 100mb
  //   sizeLimit: 50 * 1024 * 1024,
  //   mimeTypes: [
  //     'application/acad',
  //     'application/dxf',
  //     'application/x-dwf',
  //     'image/vnd.dwg',
  //     'image/x-dwg',
  //     'image/x-dxf',
  //   ],
  // },
  model: {
    title: '模型文件',
    extensions: ['3dm', 'igs', 'ctm', '4dm', 'ksp'],
    sizeLimit: 500 * 1024 * 1024,
    // mimeTypes: [],
  },
  text: {
    title: '文本文件',
    extensions: ['txt', 'json'],
    // sizeLimit: 10 * 1024 * 1024,
    // mimeTypes: ['text/plain', 'application/json'],
  },

  pdf: {
    title: 'PDF 文档',
    extensions: ['pdf'],
    // 10mb
    // sizeLimit: 100 * 1024 * 1024,
    // mimeTypes: [
    //   'application/pdf',
    // ],
  },
  word: {
    title: 'Word 文档',
    extensions: ['doc', 'docx'],
    // sizeLimit: 100 * 1024 * 1024,
    // mimeTypes: [
    //   'application/msword',
    //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // ],
  },
  sheet: {
    title: 'Excel表格',
    extensions: ['xls', 'xlsx'],
    // sizeLimit: 100 * 1024 * 1024,
    // mimeTypes: [
    //   'application/vnd.ms-excel',
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // ],
  },
  ppt: {
    title: 'ppt 文档',
    extensions: ['ppt', 'pptx'],
    // sizeLimit: 100 * 1024 * 1024,
    // mimeTypes: [
    //   'application/vnd.ms-powerpoint',
    //   'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // ],
  },
  material: {
    title: '材料文件',
    extensions: ['4ddat'],
    sizeLimit: 200 * 1024 * 1024,
  },
  ase: {
    title: 'ase文件',
    extensions: ['ase'],
  },
};

type ItemOrArray<T> = T | T[];

export function getTypeFormExt(ext: string) {
  return keys(allowMap).find(i => {
    const item = allowMap[i];
    return !!item.extensions?.includes(ext);
  });
}

function _itemIsTypeValidationOptionWithType(
  item: TypeValidationOption | TypeValidationOptionWithType,
): item is TypeValidationOptionWithType {
  return 'type' in item && typeof item.type === 'string';
}

export function getFileValidationOptions(
  allows: ItemOrArray<string | TypeValidationOption | TypeValidationOptionWithType>,
) {
  if (typeof allows === 'string') {
    allows = allows.split(',');
  }

  if (!Array.isArray(allows)) {
    allows = [allows];
  }

  const _allows = allows.map((item) => {
    if (typeof item === 'string') {
      return allowMap[item];
    }
    if (_itemIsTypeValidationOptionWithType(item)) {
      return { ...allowMap[item.type], ...item };
    }
    return item;
  });
  return _allows.reduce((memo, accept) => {
    if (accept.title) {
      memo.title.push(accept.title);
    }
    if (accept.extensions) {
      memo.extensions = memo.extensions.concat(accept.extensions);
    }
    if (accept.mimeTypes) {
      memo.mimeTypes = memo.mimeTypes.concat(accept.mimeTypes);
    }
    if (accept.sizeLimit) {
      memo.sizeLimit = Math.max(memo.sizeLimit, accept.sizeLimit);
    }
    if (typeof accept.sizeLimit === 'number') {
      if (accept.mimeTypes) {
        accept.mimeTypes.forEach((mime) => {
          // @ts-expect-error
          memo.typeSizeLimit[mime] = accept.sizeLimit;
        });
      }
      if (accept.extensions) {
        accept.extensions.forEach((ext) => {
          // @ts-expect-error
          memo.extSizeLimit[ext] = accept.sizeLimit;
        });
      }
    }
    return memo;
  }, {
    sizeLimit: 0,
    typeSizeLimit: {} as { [k: string]: number },
    extSizeLimit: {} as { [k: string]: number },
    title: [] as string[],
    extensions: [] as string[],
    mimeTypes: [] as string[],
  });
}
export default getFileValidationOptions;
