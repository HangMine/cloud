
/* eslint-disable*/

//const { Buffer } = require('buffer');

//const StreamZip = require('node-stream-zip');
const StreamZip = require('./node-stream-zip.min');
const BSON = require('./bson.min');



const DpmHelper = {

  ErrorEnum: {
    Success: {
      code: 0,
      message: '成功'
    },
    NoDiffuseColorFound: {
      code: -1,
      message: '未找到色卡信息'
    },
    DpmSizeError: {
      code: -2,
      message: 'DPM文件大小信息错误'
    },
    DpmFormatError: {
      code: -3,
      message: 'DPM格式错误'
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
      message: 'DPM文件内无材质信息'
    },
    WrongVersion: {
      code: -7,
      message: '不支持的DPM版本'
    },
    DpmBsonHeadError: {
      code: -8,
      message: 'Dpm文件信息校验失败'
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


DpmHelper.getColorCardsFromDpm_internal = function (binaryBuffer, callback) {
  try {

  } catch (err) {
    console.log(err)
    callback(DpmHelper.ErrorEnum.InternalError, null);
  } finally {

  }
};

const verifyBsonHead = function (head, headLen, rawSize) {
  if (headLen != 16 || !head)
    return false;

  let v1 = 0, v2 = 0;
  let value = 0;

  for (let i = 0; i < headLen - 2; i++) {
    value = head[i];
    if (i < 4) {
      if (value != ((rawSize >> i * 8) & 0xFF)) {
        return false;
      }
    }

    v1 += value;

    if (i % 2 == 0)
      v2 += value;
    else
      v2 -= value;
  }

  if (head[headLen - 2] != (v1 & 0xFF))
    return false;
  if (head[headLen - 1] != (v2 & 0xFF))
    return false;

  return true;
}

function _getNextObjectSize(buffer) {
  // this is how BSON
  return buffer[0] | (buffer[1] << 8) | (buffer[2] << 16) | (buffer[3] << 24);
}

function deserialize(buffer, options) {
  let _buffer = buffer;
  let _result = [];

  while (_buffer.length > 0) {
    let nextSize = _getNextObjectSize(_buffer);
    if (_buffer.length < nextSize) {
      throw new Error("Corrupted BSON file: the last object is incomplete.");
    }
    else if (_buffer[nextSize - 1] !== 0) {
      throw new Error(`Corrupted BSON file: the ${_result.length + 1}-th object does not end with 0.`);
    }

    let obj = BSON.deserialize(_buffer, {
      ...options,
      allowObjectSmallerThanBufferSize: true,
      promoteBuffers: true // Since BSON support raw buffer as data type, this config allows
      // these buffers as is, which is valid in JS object but not in JSON
    });
    _result.push(obj);
    _buffer = _buffer.slice(nextSize);
  }

  return _result;
}


const getColorCardsFromDpm = async function (filePath, callback) {
  let zip;
  try {

    if (callback == null) {
      callback = function () { };
    }

    if (filePath == null) {
      callback(DpmHelper.ErrorEnum.ParamError, null);
      return;
    }

    zip = new StreamZip.async({
      file: filePath,
      storeEntries: true
    });
    if (!zip) {
      callback(DpmHelper.ErrorEnum.InternalError);
      return;
    }

    const data = await zip.entryData('description');
    const verifyResult = verifyBsonHead(data, 16, data.length - 16);
    if (!verifyResult) {
      callback(DpmHelper.ErrorEnum.DpmBsonHeadError);
      return;
    }
    const bsonData = data.slice(16);
    const doc = BSON.deserialize(bsonData, { allowObjectSmallerThanBufferSize: true });
    try {
      const color = doc.material.layers[0].basic.basecolor.color;
      if (color.type !== 'solid') {
        callback(DpmHelper.ErrorEnum.UserSpecifiedNotToAdjustColor);
        return;
      }
      callback(DpmHelper.ErrorEnum.Success, color.solid.block);
    }
    catch (err) {
      callback(DpmHelper.ErrorEnum.UserSpecifiedNotToAdjustColor);
      return;
    }




  } catch (err) {
    console.log(err)
    callback(DpmHelper.ErrorEnum.InternalError);
  } finally {
    if (zip) {
      await zip.close();
    }

  }
};

exports.getColorCardsFromDpm = getColorCardsFromDpm;
