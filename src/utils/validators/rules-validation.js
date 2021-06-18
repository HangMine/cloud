/**
 * \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
 * 请不要再在这个文件添加并且使用element-ui的校验器
 * 为了确保大家都已读，请在该备注尾部署名
 * /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
 *
 * 校验器（validator）在后续的版本的定义将更改为
 * “一个不返回任何东西，只抛出错误的函数或异步函数”
 * 当前文件会被按情况废弃
 *
 * 【validator是什么】
 * 比如下面的一个校验器：
 * @example
 * // 第一个参数必须是校验的对象，第二参数是一个对象，用于校验的其他判断条件
 * function required(value) {
 *    // 如果已经填了，则return;
 *    if (value) return;
 *    // 否则抛出错误
 *    throw new Error('此值必填')
 * }
 *
 * 【在element-ui使用校验器】
 * 使用validator2ElemValidator、validator2ElemRule
 * @see {./index}
 * @example
 *
 * rules: {
 *    name: validator2ElemRule(required)
 * }
 *
 * 注意的是，由于validate.js的bug，rule并不能存在由两个validator2ElemRule转换的rule
 * 如需使用两个校验器
 *
 * rules: {
 *    name: validator2ElemRule([required, required2])
 * }
 *
 * 【校验器写在哪？】
 * 写在当前你正在看的文件所在文件夹底下，并在index.js import并export，
 * 尽量以一个完整归类的校验器集合或者单个校验器作为一个文件
 *
 * 【署名】
 * 浩锋 黄月成
 */

import i18n from '@/i18n';
import strLength from './str-length';
import validateForm from './validate-form';
import validator2ElemRule from './utils/validator-to-elem-validator';
/**
 * 校验form表单（校验不通过会返回校验不同的fields);
 * @param {DOM} form
 * @returns {Promise}
 */
export const validateFormFields = validateForm;


export const validator = {
  // 校验字符串长度
  strLength,
  // 校验两次密码是否相同
  passwordConfirm(passwordConfirm, {
    password,
  }) {
    if (password === '') {
      throw new Error(i18n.t('validator.not_empty'));
    }
    if (password !== passwordConfirm) {
      throw new Error(i18n.t('validator.same_as_prev'));
    }
  },
};

const roleGenerator = {

  /**
   * 用于多个条件规则校验，校验的顺序按传入参数的顺序
   * @param {validations}
   * @returns {Array} rules 规则的数组集合
   */
  rules(...validations) {
    if (!validations.length) throw new Error('require at lest one parameter');

    return validations.map(prop => this[prop]());
  },

  /* ============================= 字符相关 =============================== */

  // 开头和结尾不能为空校验
  spaceTrim: () => ({
    pattern: /(^\S.*\S$)|^\S$/,
    message: '不允许以空格开头或结尾',
  }),

  // 内容不能为空
  requirement(trigger) {
    return {
      trigger,
      required: true,
      message: i18n.t('validator.not_empty'),
    };
  },
  // 至少选择其中一个
  selection() {
    return {
      required: true,
      message: i18n.t('validator.at_least_one_option'),
    };
  },

  // 验证邮箱
  email(trigger) {
    return {
      trigger,
      type: 'email',
      message: '电子邮箱地址无效',
    };
  },


  // 正数、负数、和小数
  number() {
    return {
      pattern: /^(-|\+)?\d+(\.\d+)?$/,
      message: i18n.t('validator.must_be_num'),
    };
  },
  // 正整数
  numberPositive() {
    return {
      pattern: /^((0\.\d+)|([1-9]\d*\.\d+)|([1-9]+\d*))$/,
      message: i18n.t('validator.num_positive'),
    };
  },
  // 非零的正整数
  numberNatural() {
    return {
      pattern: /^[1-9]+$/,
      message: i18n.t('validator.num_natural'),
    };
  },
  // 正整数
  integerPositive() {
    return {
      pattern: /^[0-9]+$/,
      message: i18n.t('validator.integer_positive'),
    };
  },


  // 不能包含特殊字符（除字母和数字外）
  charTypeWithNormal(message = i18n.t('validator.not_special_char')) {
    return {
      pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
      message,
    };
  },

  // 不能包含特殊字符（除字母和数字@外）
  charTypeWithoutEmail() {
    return {
      pattern: /^[\u4E00-\u9FA5A-Za-z0-9_@.]+$/,
      message: i18n.t('validator.not_special_char'),
    };
  },


  //
  numberAndAlphabet() {
    return {
      pattern: /^(?![^a-zA-Z]+$)(?![^_]+$)|^(?![^a-zA-Z]+$)(?!\D+$)/,
      message: i18n.t('validator.num_and_alpha'),
    };
  },

  numAlphabetUnderscore() {
    return {
      pattern: /(?:\d.*_)|(?:_.*\d)|(?:[A-Za-z].*_)|(?:_.*[A-Za-z])|(?:[A-Za-z].*\d)|(?:\d.*[A-Za-z])/,
      message: i18n.t('validator.num_alpha_underscore'),
    };
  },

  // 字符长度在一定区间内
  charLength(min = 0, max = 0) {
    return validator2ElemRule(validator.strLength, {
      min,
      max,
    });
  },

  // 检验两次密码是否相同
  passwordConfirm(password) {
    return validator2ElemRule(validator.checkPasswordRepeat, {
      password,
    });
  },


  phone: () => ({
    pattern: /^[0-9-\s]{6,30}$/,
    message: '不是有效的电话号码',
  }),

  mobilePhoneChina: () => ({
    pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
    message: i18n.t('validator.invalid_phone'),
  }),


  // 字符长度在一定区间内
  charLengthRange: (min = 1, max = 2) => {
    return [

      {
        min,
        message: `字符长度至少为(${min})`,
      },
      {
        max,
        message: `超过字符数(${max})限制`,
      },
    ];
  },
  // 字符最少长度
  charLengthMini: (min) => ({
    min,
    message: `字符长度至少为(${min})`,
  }),
  // 字符最少长度
  charLengthMax: (max) => ({
    max,
    message: `不能超过(${max})字符`,
  }),
  // 字符固定长度
  charFixedLength: (len) => ({
    len,
    message: `请输入${len}个字符`,
  }),
  // 包含中文、大小字母、数字、下划线、空格
  charTypeNormal() {
    return {
      pattern: /^[\u4E00-\u9FA5A-Za-z0-9_\s]+$/,
      message: i18n.t('validator.not_special_char'),
    };
  },
  // 包含中文、大小字母、数字、空格
  charTypeNormal1() {
    return {
      pattern: /^[\u4E00-\u9FA5A-Za-z0-9\s]+$/,
      message: i18n.t('validator.not_special_char'),
    };
  },
  // 由任意字符组成，不能为纯数字或纯字母
  charTypeNotOnlyDigitOrLatin() {
    return {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$).+$/,
      message: i18n.t('validator.not_only_digit_letter'),
    };
  },
  // 由数字和字母组成，并且要同时含有数字和字母
  charTypeDigitAndLatin() {
    return {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/,
      message: i18n.t('validator.must_digit_letter'),
    };
  },
  // 由数字和字母组成，并且要同时含有数字和字母
  charTypeDigitOrLatin() {
    return {
      pattern: /^[a-zA-Z0-9]+$/,
      message: i18n.t('validator.only_digit_letter'),
    };
  },
  // 由数字和-组成
  charTypeDigitAndHyphen() {
    return {
      pattern: /^[0-9-]+$/,
      message: i18n.t('validator.only_digit_hyphen'),
    };
  },
};

Object.keys(roleGenerator).forEach(key => {
  roleGenerator[`validate${key.charAt(0).toUpperCase()}${key.substr(1)}`] = roleGenerator[key];
});

export default roleGenerator;
