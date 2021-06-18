import { Validator } from '@/typings/validator.d';
import { getMessage } from '@/utils/error-handler';
/**
 * 将一个校验器转换为element-form的校验器
 * @param validatorsOrValidator 校验器
* @param mixin 混合参数 - 该参数会混入校验器，和rule本身共同组成校验器的第二个参数
 */
export function validator2ElemValidator<T, M extends Object>(
  validatorsOrValidator: Validator<T> | Validator<T>[],
  mixin: M = {} as M,
) {
  let validators: Validator<T>[];
  if (!Array.isArray(validatorsOrValidator)) {
    validators = [validatorsOrValidator];
  } else {
    validators = validatorsOrValidator;
  }
  return (rule: Object, value: T, callback: Function) => {
    let pipe = Promise.resolve();
    validators.forEach(validator => {
      pipe = pipe.then(() => validator(value, { ...mixin, ...rule }));
    });
    pipe.then(() => {
      callback();
    }, (e) => {
      e.message = getMessage(e);
      callback(e);
    });
  };
}
export default validator2ElemValidator;
