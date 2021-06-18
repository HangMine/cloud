
/* eslint-disable*/
import FileReader from '@/utils/FileReader'
const COLOR_START = 0x0001;
const GROUP_START = 0xc001;
const GROUP_END = 0xc002;

function lab2rgb(lab) {
  let y = (lab[0] + 16) / 116;
  let x = lab[1] / 500 + y;
  let z = y - lab[2] / 200;
  let r;
  let g;
  let b;

  x = 0.95047 * (x * x * x > 0.008856 ? x * x * x : (x - 16 / 116) / 7.787);
  y = 1.0 * (y * y * y > 0.008856 ? y * y * y : (y - 16 / 116) / 7.787);
  z = 1.08883 * (z * z * z > 0.008856 ? z * z * z : (z - 16 / 116) / 7.787);

  r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  b = x * 0.0557 + y * -0.204 + z * 1.057;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return [
    Math.max(0, Math.min(1, r)) * 255,
    Math.max(0, Math.min(1, g)) * 255,
    Math.max(0, Math.min(1, b)) * 255,
  ];
}

function cmyk2rgb(cmyk) {
  const c = cmyk[0];
  const m = cmyk[1];
  const y = cmyk[2];
  const k = cmyk[3];

  const c1 = 1 - c;
  const m1 = 1 - m;
  const k1 = 1 - k;
  const y1 = 1 - y;
  let x;
  let r;
  let g;
  let b;
  r = g = b = c1 * m1 * y1 * k1;
  x = c1 * m1 * y1 * k;
  r += 0.1373 * x;
  g += 0.1216 * x;
  b += 0.1255 * x;
  x = c1 * m1 * y * k1;
  r += x;
  g += 0.949 * x;
  x = c1 * m1 * y * k;
  r += 0.1098 * x;
  g += 0.102 * x;
  x = c1 * m * y1 * k1;
  r += 0.9255 * x;
  b += 0.549 * x;
  x = c1 * m * y1 * k;
  r += 0.1412 * x;
  x = c1 * m * y * k1;
  r += 0.9294 * x;
  g += 0.1098 * x;
  b += 0.1412 * x;
  x = c1 * m * y * k;
  r += 0.1333 * x;
  x = c * m1 * y1 * k1;
  g += 0.6784 * x;
  b += 0.9373 * x;
  x = c * m1 * y1 * k;
  g += 0.0588 * x;
  b += 0.1412 * x;
  x = c * m1 * y * k1;
  g += 0.651 * x;
  b += 0.3137 * x;
  x = c * m1 * y * k;
  g += 0.0745 * x;
  x = c * m * y1 * k1;
  r += 0.1804 * x;
  g += 0.1922 * x;
  b += 0.5725 * x;
  x = c * m * y1 * k;
  b += 0.0078 * x;
  x = c * m * y * k1;
  r += 0.2118 * x;
  g += 0.2119 * x;
  b += 0.2235 * x;
  return [Math.round(255 * r), Math.round(255 * g), Math.round(255 * b)];
}
class BufferReader {
  constructor(arrayBuffer, byteOffset, byteLength, littleEndian) {
    this.dataView = new DataView(arrayBuffer, byteOffset, byteLength);
    this.littleEndian = littleEndian;
    this.length = byteLength;
    this.offset = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  byteToString(arr) {
    if (typeof arr === 'string') {
      return arr;
    }
    let str = '';
    const _arr = arr;
    for (let i = 0; i < _arr.length; i++) {
      const one = _arr[i].toString(2);
      const v = one.match(/^1+?(?=0)/);
      if (v && one.length == 8) {
        const bytesLength = v[0].length;
        let store = _arr[i].toString(2).slice(7 - bytesLength);
        for (let st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2);
        }
        str += String.fromCharCode(parseInt(store, 2));
        i += bytesLength - 1;
      } else {
        str += String.fromCharCode(_arr[i]);
      }
    }
    return str;
  }

  nextChar8() {
    const value = this.nextUint8();
    return this.byteToString([value]);
  }

  nextChar16() {
    const value = this.nextUint16();
    return this.byteToString([value]);
  }

  nextSectionChar(length) {
    const dataArr = [];
    while (this.offset < length) {
      dataArr.push(this.nextUint8());
    }
    return this.byteToString(dataArr);
  }

  nextUint8() {
    const value = this.dataView.getUint8(this.offset, this.littleEndian);

    this.offset += 1;

    return value;
  }

  nextUint16() {
    const value = this.dataView.getUint16(this.offset, this.littleEndian);

    this.offset += 2;

    return value;
  }

  nextUint32() {
    const value = this.dataView.getUint32(this.offset, this.littleEndian);

    this.offset += 4;

    return value;
  }

  nextFloat32() {
    const value = this.dataView.getFloat32(this.offset, this.littleEndian);

    this.offset += 4;

    return value;
  }

  nextSectionArrayBuffer(length) {
    const dataArr = [];
    while (this.offset < length) {
      dataArr.push(this.nextUint8());
    }
    return dataArr;
  }
}

export default class BinLoader {
  constructor() { }

  async load(file, onLoad, onError) {
    const reader = new FileReader()
    const arrayBuffer = await reader.readAsArrayBuffer(file);
    const dwmData = this.parse(arrayBuffer);
    return dwmData;
  }

  parse(buffer) {
    return new ASEBufferContainer(buffer).output;
  }
}

class ASEBufferContainer {
  constructor(arrayBuffer) {
    this.colors = [];
    this.groups = [];
    this.output = {};

    this.colorTypeSizes = {
      CMYK: 4, RGB: 3, LAB: 3, GRAY: 1,
    };
    this.colorTypes = { 0: 'global', 1: 'spot', 2: 'normal' };

    const idByteLength = 4;
    let totalOffset = 0;
    // 合法校验
    const littleEndian = false;
    const headerReader = new BufferReader(
      arrayBuffer,
      0,
      idByteLength,
      littleEndian,
    );
    const identifier = headerReader.nextSectionChar(idByteLength);
    if (identifier != 'ASEF') {
      throw new Error(`ASE文件格式不合法: ${identifier}`);
      return;
    }
    totalOffset += idByteLength;
    // 版本信息
    const versionByteLength = 4;
    const versionReader = new BufferReader(
      arrayBuffer,
      totalOffset,
      versionByteLength,
      littleEndian,
    );
    const versionInfo = [
      versionReader.nextUint16(),
      versionReader.nextUint16(),
    ];
    totalOffset += versionByteLength;
    // 数据Header
    const blockNumberByteLength = 4;
    const blockHeaderReader = new BufferReader(
      arrayBuffer,
      totalOffset,
      blockNumberByteLength,
      littleEndian,
    );
    const blockDataNumber = blockHeaderReader.nextUint32();
    totalOffset += blockNumberByteLength;
    // 逐分块读取
    const blockDataByteLength = arrayBuffer.byteLength - totalOffset;
    const blockDataReader = new BufferReader(
      arrayBuffer,
      totalOffset,
      blockDataByteLength,
      littleEndian,
    );
    let block; let group; let
      color;
    for (let i = 0; i < blockDataNumber; i++) {
      // BlockType
      const blockType = blockDataReader.nextUint16();
      switch (blockType) {
        case COLOR_START:
          this.colors.push((block = color = {}));
          break;
        case GROUP_START:
          this.groups.push((block = group = { colors: [] }));
          break;
        case GROUP_END:
          group = null;
          break;
        default:
          throw new Error(`不支持的分块数据类型：${position}`);
          break;
      }
      if (group && block === color) {
        group.colors.push(color);
      }
      // 具体数据结构解析
      const blockSize = blockDataReader.nextUint32();
      if (blockSize > 0) {
        let length = blockDataReader.nextUint16();
        let name = '';
        while (--length) {
          name += blockDataReader.nextChar16();
        }
        block.name = name;
        blockDataReader.nextChar16();
        block.model = '';
        for (let i = 0; i < 4; i++) {
          block.model += blockDataReader.nextChar8();
        }
        // Get color data
        const model = block.model.toUpperCase().trim();
        let count = this.colorTypeSizes[model];
        let channels = [];
        while (count--) {
          channels.push(blockDataReader.nextFloat32());
        }
        // All to RGB(0-255)
        switch (model) {
          case 'LAB':
            channels[0] *= 100;
            channels = lab2rgb(channels);
            break;
          case 'RGB':
            channels[0] *= 255;
            channels[1] *= 255;
            channels[2] *= 255;
            break;
          case 'CMYK':
            channels = cmyk2rgb(channels);
            break;
          case 'Gray':
            channels = [channels[0], channels[0], channels[0]]
            break;
          default:
            break;
        }
        block.color = channels;
        block.type = this.colorTypes[blockDataReader.nextUint16()];

        delete color.model // 实际上color值是处理过后的rgb值,这里的model还是为LAB,语义不明,先去除
        delete color.type // type暂时不需要用到
      }
    }

    this.output = {
      colors: this.colors,
      groups: this.groups,
      version: versionInfo,
    };
  }
}


