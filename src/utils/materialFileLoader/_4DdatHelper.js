
/* eslint-disable*/

const { Buffer } = require('buffer');
const lz4 = require('lz4js');

const _4DdatHelper = {
  UInt32Size: 4,
  FloatSize: 4,
  sizeof_S4DdatStructureHead: 264, // sizeof(S4DdatStructureHead);
  sizeof_S4DdatMaterialHead: 600, // sizeof(S4DdatMaterialHead)
  sizeof_S4DdatMaterialPropertyHead: 258,
  FOUR_DDAT_LEFT_MAX_LEN: 257,
  PROPERTY_TYPE_VEC3: 6,
  PROPERTY_TYPE_IMAGE: 4,
  PROPERTY_TYPE_BOOL: 1,
  diffuseColor_str: 'diffuseColor',
  diffuseTexture_str: 'uTexColor',
  needAdjustColor_str: 'needAdjustColor',
  ErrorEnum: {
    Success: {
      code: 0,
      message: '成功'
    },
    NoDiffuseColorFound: {
      code: -1,
      message: '未找到色卡信息'
    },
    _4DdatSizeError: {
      code: -2,
      message: '4Ddat文件大小信息错误'
    },
    _4DdatFormatError: {
      code: -3,
      message: '4Ddat格式错误'
    },
    ReadFileFailed: {
      code: -4,
      message: '文件读取失败'
    },
    ParamError: {
      code: -5,
      message: '内部参数错误'
    },
    NoResourceFound: {
      code: -6,
      message: '4Ddat文件内无材质信息'
    },
    WrongVersion: {
      code: -7,
      message: '不支持的4Ddat版本'
    },
    InternalError: {
      code: -100,
      message: '内部错误'
    },
    UserSpecifiedNotToAdjustColor: {
      code: -1000,
      message: '无改色信息'
    },
  },
  MAX_CHAR: 256
};

_4DdatHelper.diffuseColor_str_len = _4DdatHelper.diffuseColor_str.length;
_4DdatHelper.diffuseTexture_str_len = _4DdatHelper.diffuseTexture_str.length;
_4DdatHelper.needAdjustColor_str_len = _4DdatHelper.needAdjustColor_str.length;

_4DdatHelper.SundayPre = function (sun_shift, pattern, patternLen) {
  for (let i = 0; i < _4DdatHelper.MAX_CHAR; i++) {
    sun_shift[i] = patternLen + 1;
  }
  // 模式串pattern中每个字母出现的最后的下标
  // 所对应的主串参与匹配的最末位字符的下一位字符移动到该位，所需要的移动位数
  for (let i = 0; i < patternLen; i++) {
    sun_shift[pattern[i]] = patternLen - i;
  }
}

/*
function:
    Sunday字符匹配算法
Param:
@buffer 文本内容
@bufferLen 文本内容长度
@pattern 需要匹配的字符串
@patternLen 需要匹配的字符串长度
*/
_4DdatHelper.Sunday = function (buffer, bufferLen, pattern_, patternLen, fromIndex) {

  const pattern = Buffer.from(pattern_)
  const sun_shift = Buffer.alloc(_4DdatHelper.MAX_CHAR)
  _4DdatHelper.SundayPre(sun_shift, pattern, patternLen)


  // 模式串开始位置在主串的哪里
  let pos = fromIndex ? fromIndex : 0;
  //printf("Sunday pos %d\n",pos);
  //模式串已经匹配到的位置
  let j, count = 0;
  while (pos <= bufferLen - patternLen) {
    j = 0;
    while (buffer[pos + j] == pattern[j] && j < patternLen)
      j++;
    // 匹配成功
    if (j >= patternLen) {
      //printf("Sunday Find it. the position is %d  jump %d time\n",pos,count);
      return pos;
    }
    else {
      // 找到主串中当前跟模式串匹配的最末字符的下一个字符
      // 在模式串中出现最后的位置
      // 所需要从(模式串末尾+1)移动到该位置的步数
      //printf("Sunday current step: %d jump num: %d\n",count++,shift[buffer[pos+patternLen]]);
      pos += sun_shift[buffer[pos + patternLen]];
      //count++;
      //printf("pos %d\n",pos);
    }
  }
  //printf("Sunday not Find. jump %d time\n",count);
  return -1;
}

_4DdatHelper.getIntFromBuffer = function (buffer) {
  if (buffer == null) {
    return null;
  }
  return buffer.readUInt32LE(0);
};


_4DdatHelper.getBoolFromBuffer = function (buffer) {
  if (buffer == null) {
    return null;
  }
  return buffer[0];
};

_4DdatHelper.readBufferFromOffsetWithLength = function (arrayBuffer, offset, len) {
  return Buffer.from(arrayBuffer.slice(offset, offset + len));
};

_4DdatHelper.readUInt32FromOffset = function (binaryBuffer, offset) {
  const buffer = _4DdatHelper.readBufferFromOffsetWithLength(binaryBuffer, offset, _4DdatHelper.UInt32Size);
  return _4DdatHelper.getIntFromBuffer(buffer);
};

_4DdatHelper.readDiffuseColor = function (materialBuff, materialSize) {
  let diffuseColorIndex = -1;
  let currentOffset;
  while (true) {
    diffuseColorIndex = _4DdatHelper.Sunday(materialBuff, materialSize, _4DdatHelper.diffuseColor_str, _4DdatHelper.diffuseColor_str_len, diffuseColorIndex + 1)

    //diffuseColorIndex = materialBuffString.indexOf(
    //  "diffuseColor",
    //  diffuseColorIndex
    //);
    if (diffuseColorIndex < 0) {
      return _4DdatHelper.ErrorEnum.NoDiffuseColorFound;
    }

    currentOffset = diffuseColorIndex + _4DdatHelper.FOUR_DDAT_LEFT_MAX_LEN;
    if (materialBuff[currentOffset] !== _4DdatHelper.PROPERTY_TYPE_VEC3) {
      continue;
    }

    let ch = materialBuff[diffuseColorIndex + _4DdatHelper.diffuseColor_str_len]
    if (ch != 0) {
      continue;
    }

    /*
    currentOffset = diffuseColorIndex + _4DdatHelper.diffuseColor_str_len;
    let needContinue = false;
    for (let i = 0; i < _4DdatHelper.FOUR_DDAT_LEFT_MAX_LEN - _4DdatHelper.diffuseColor_str_len; i++) {
      if (materialBuff[currentOffset + i] !== 0) {
        needContinue = true;
        break;
      }
    }

    if (needContinue) {
      continue;
    }
    */

    currentOffset = diffuseColorIndex + _4DdatHelper.sizeof_S4DdatMaterialPropertyHead;
    const r = materialBuff.readFloatLE(currentOffset);
    currentOffset += _4DdatHelper.FloatSize;

    const g = materialBuff.readFloatLE(currentOffset);
    currentOffset += _4DdatHelper.FloatSize;

    const b = materialBuff.readFloatLE(currentOffset);
    currentOffset += _4DdatHelper.FloatSize;

    return [r * 255, g * 255, b * 255];
  }
};


_4DdatHelper.hasDiffuseTexture = function (materialBuff, materialSize) {
  let diffuseColorIndex = -1;
  let currentOffset;
  while (true) {
    diffuseColorIndex = _4DdatHelper.Sunday(materialBuff, materialSize, _4DdatHelper.diffuseTexture_str, _4DdatHelper.diffuseTexture_str_len, diffuseColorIndex + 1)

    //diffuseColorIndex = materialBuffString.indexOf(
    //  "diffuseColor",
    //  diffuseColorIndex
    //);
    if (diffuseColorIndex < 0) {
      return false;
    }
    let ch = materialBuff[diffuseColorIndex + _4DdatHelper.diffuseTexture_str_len]
    if (ch != 0) {
      continue;
    }

    currentOffset = diffuseColorIndex + _4DdatHelper.FOUR_DDAT_LEFT_MAX_LEN;
    if (materialBuff[currentOffset] !== _4DdatHelper.PROPERTY_TYPE_IMAGE) {
      continue;
    }
    /*
        currentOffset = diffuseColorIndex + _4DdatHelper.diffuseTexture_str_len;
        let needContinue = false;
        for (let i = 0; i < _4DdatHelper.FOUR_DDAT_LEFT_MAX_LEN - _4DdatHelper.diffuseTexture_str_len; i++) {
          if (materialBuff[currentOffset + i] !== 0) {
            needContinue = true;
            break;
          }
        }

        if (needContinue) {
          continue;
        }
    */
    return true;
  }
};

_4DdatHelper.readNeedAdjustColor = function (materialBuff, materialSize) {
  let diffuseColorIndex = -1;
  let currentOffset;
  while (true) {
    diffuseColorIndex = _4DdatHelper.Sunday(materialBuff, materialSize, _4DdatHelper.needAdjustColor_str, _4DdatHelper.needAdjustColor_str_len, diffuseColorIndex + 1)

    //diffuseColorIndex = materialBuffString.indexOf(
    //  "diffuseColor",
    //  diffuseColorIndex
    //);
    if (diffuseColorIndex < 0) {
      return false;
    }

    let ch = materialBuff[diffuseColorIndex + _4DdatHelper.needAdjustColor_str_len]
    if (ch != 0) {
      continue;
    }

    currentOffset = diffuseColorIndex + _4DdatHelper.FOUR_DDAT_LEFT_MAX_LEN;
    if (materialBuff[currentOffset] !== _4DdatHelper.PROPERTY_TYPE_BOOL) {
      continue;
    }

    /*
    currentOffset = diffuseColorIndex + _4DdatHelper.needAdjustColor_str_len;
    let needContinue = false;
    for (let i = 0; i < _4DdatHelper.FOUR_DDAT_LEFT_MAX_LEN - _4DdatHelper.needAdjustColor_str_len; i++) {
      if (materialBuff[currentOffset + i] !== 0) {
        needContinue = true;
        break;
      }
    }

    if (needContinue) {
      continue;
    }
    */

    currentOffset = diffuseColorIndex + _4DdatHelper.sizeof_S4DdatMaterialPropertyHead;
    let needAdjustColor = materialBuff[currentOffset];
    needAdjustColor = needAdjustColor ? true : false; //for debug

    return needAdjustColor;
  }
};

_4DdatHelper.read4DdatV1 = function (binaryBuffer) {
  let currentOffset = _4DdatHelper.sizeof_S4DdatStructureHead + _4DdatHelper.FOUR_DDAT_LEFT_MAX_LEN - _4DdatHelper.UInt32Size;
  const materialCompressedSize = _4DdatHelper.readUInt32FromOffset(binaryBuffer, currentOffset);
  currentOffset = _4DdatHelper.sizeof_S4DdatStructureHead + _4DdatHelper.sizeof_S4DdatMaterialHead - _4DdatHelper.UInt32Size;
  const materialSize = _4DdatHelper.readUInt32FromOffset(binaryBuffer, currentOffset);
  let materialBuff;
  if (materialSize > 0) {
    const compressedBuff_ = _4DdatHelper.readBufferFromOffsetWithLength(
      binaryBuffer,
      _4DdatHelper.sizeof_S4DdatStructureHead + _4DdatHelper.sizeof_S4DdatMaterialHead,
      materialCompressedSize,
    );
    // let fd1 = fs.openSync("./compressedBuff", "w");
    // fs.writeSync(fd1, compressedBuff, 0, materialCompressedSize, 0);
    // fs.closeSync(fd1)


    // materialBuff = new Uint8Array(materialSize);
    // LZ4LIB_API int LZ4_decompress_safe (const char* src, char* dst, int compressedSize, int dstCapacity);
    // let LZ4_decompress_safe = Module.cwrap('LZ4_decompress_safe', 'number', ['array', 'array', 'number', 'number']);
    const compressedBuff = Buffer.from(compressedBuff_);
    materialBuff = Buffer.alloc(materialSize);

    //const decompressed = lz4.decodeBlock(compressedBuff, materialBuff);
    //src, dst, sIndex, sLength, dIndex
    const decompressed = lz4.decompressBlock(compressedBuff, materialBuff, 0, materialCompressedSize, 0);
    // let decompressed = LZ4_decompress_safe(compressedBuff_, materialBuff, materialCompressedSize, materialSize);
    if (decompressed != materialSize) {
      return _4DdatHelper.ErrorEnum._4DdatSizeError;
    }
    // let fd1 = fs.openSync("./decompressedBuff", "w");
    // fs.writeSync(fd1, materialBuff, 0, materialSize, 0);
    // fs.closeSync(fd1)
  } else {
    materialBuff = _4DdatHelper.readBufferFromOffsetWithLength(
      binaryBuffer,
      _4DdatHelper.sizeof_S4DdatStructureHead + _4DdatHelper.sizeof_S4DdatMaterialHead,
      materialSize,
    );
    materialBuff = Buffer.from(materialBuff);
  }

  //let materialBuffString = materialBuff.toString("ascii");


  //get diffuseColor first
  let diffuseColor = _4DdatHelper.readDiffuseColor(materialBuff, materialSize);
  if (!(diffuseColor instanceof Array)) {
    return diffuseColor;
  }

  let hasDiffuseTexture = _4DdatHelper.hasDiffuseTexture(materialBuff, materialSize);
  if (!hasDiffuseTexture)
    return diffuseColor;

  let needAdjustColor = _4DdatHelper.readNeedAdjustColor(materialBuff, materialSize);
  if (needAdjustColor)
    return diffuseColor;

  return _4DdatHelper.ErrorEnum.UserSpecifiedNotToAdjustColor;



};


_4DdatHelper.getDiffuseColorFrom4Ddat_internal = function (binaryBuffer, callback) {
  try {
    let currentOffset = 0;
    const readLen = 5;
    const buffer = _4DdatHelper.readBufferFromOffsetWithLength(binaryBuffer, 0, readLen);
    currentOffset += readLen;

    if (
      buffer[0] != 52
      || buffer[1] != 68
      || buffer[2] != 100
      || buffer[3] != 97
      || buffer[4] != 116
    ) {
      // 4Ddat
      callback(_4DdatHelper.ErrorEnum._4DdatFormatError, null);
      return;
    }

    const versionMajor = _4DdatHelper.readUInt32FromOffset(binaryBuffer, currentOffset);
    currentOffset += _4DdatHelper.UInt32Size;

    const versionMinor = _4DdatHelper.readUInt32FromOffset(binaryBuffer, currentOffset);
    currentOffset += _4DdatHelper.UInt32Size;

    const versionPatch = _4DdatHelper.readUInt32FromOffset(binaryBuffer, currentOffset);
    currentOffset += _4DdatHelper.UInt32Size;

    const materialNum = _4DdatHelper.readUInt32FromOffset(
      binaryBuffer,
      _4DdatHelper.sizeof_S4DdatStructureHead - 4,
    );
    if (materialNum != 1) {
      callback(_4DdatHelper.ErrorEnum.NoResourceFound, null);
      return;
    }

    let serializerVersion = 0;

    if (versionMajor == 1 && versionMinor >= 1 && versionPatch == 0) {
      serializerVersion = 1;
      const diffuseColor = _4DdatHelper.read4DdatV1(binaryBuffer);
      if (diffuseColor instanceof Array && diffuseColor.length == 3) {
        callback(_4DdatHelper.ErrorEnum.Success, diffuseColor);
        return;
      } else {
        callback(diffuseColor, null);
        return;
      }
    }
    else {
      callback(_4DdatHelper.ErrorEnum.WrongVersion, null);
      return;
    }
  } catch (err) {
    console.log(err)
    callback(_4DdatHelper.ErrorEnum.InternalError, null);
    return;
  } finally {

  }
};

export const getDiffuseColorFrom4Ddat = function (filePath, callback) {
  try {
    if (callback == null) {
      callback = function () { };
    }

    if (filePath == null) {
      callback(_4DdatHelper.ErrorEnum.ParamError, null);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function () {
      _4DdatHelper.getDiffuseColorFrom4Ddat_internal(fileReader.result, callback);
    };
    fileReader.onerror = function () {
      callback(_4DdatHelper.ErrorEnum.ReadFileFailed, null);
    };
    fileReader.readAsArrayBuffer(filePath);
  } catch (err) {
    callback(_4DdatHelper.ErrorEnum.InternalError);
    return;
  } finally {

  }
};

export default getDiffuseColorFrom4Ddat;
