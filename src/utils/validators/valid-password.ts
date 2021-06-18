import i18n from '@/i18n';
import strLength from '@/utils/validators/str-length';

export function validPassword(pass: string) {
  // const reg = /^(?![0-9]+$)(?![a-zA-Z]+$).+$/;
  // if (!reg.test(pass)) {
  //   throw new Error(i18n.t('validator.not_only_digit_letter'));
  // }
  if (!pass) {
    return;
  }


  // 1.长度为6-20个字符
  // strLength(pass, { min: 6, max: 20 });
  try {
    strLength(pass, { min: 6, max: 20 });
  } catch (e) {
    // throw new Error(i18n.t('validator.pass.char_len_between', { min: 6, max: 20 }));
    throw new Error('长度为 6 - 20 个字符');
  }

  // 2.只能输入可见的ASCII字符
  // new Array(127 - 33).fill(0).map((v, i) => String.fromCharCode(i + 33)).join('')
  // !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
  // !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
  // 注意中间一部分需要转义: [\] => [\\\]
  // if (/[^`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、A-Za-z0-9]/.test(pass)) {
  if (/[^!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~A-Za-z0-9]/.test(pass)) {
    throw new Error(i18n.t('validator.pass.ascii_char_only'));
  }

  // 3.至少包含数字/字符/大写字母/小写字母中的三种
  const hasNum = /\d/.test(pass);
  const hasChar = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(pass);
  const hasUpperCase = /[A-Z]/.test(pass);
  const hasLowerCase = /[a-z]/.test(pass);
  const score = [hasNum, hasChar, hasUpperCase, hasLowerCase].reduce(((total, v) => total + (v ? 1 : 0)), 0);
  // console.log('score=====', score);
  if (score < 3) {
    throw new Error(i18n.t('validator.pass.choose_three'));
  }
}

export default validPassword;
