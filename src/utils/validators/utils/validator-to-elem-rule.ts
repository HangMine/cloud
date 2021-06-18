import { Validator } from '@/typings/validator.d';
import validator2ElemValidator from './validator-to-elem-validator';


/**
 * 将一个校验器转换为element-form的规则
 * @param validatorsOrValidator 校验器
 * @param mixin 混合参数 - 该参数会混入rule
 */
export function validator2ElemRule<T, M extends Object>(
  validatorsOrValidator: Validator<T> | Validator<T>[],
  mixin: M = {} as M,
) {
  return {
    validator: validator2ElemValidator(validatorsOrValidator),
    ...mixin,
  };
}


export function validator2ElemRules<T, M extends Object>(
  validatorsOrValidator: Validator<T> | Validator<T>[],
  mixin: M = {} as M,
) {
  const validators = Array.isArray(validatorsOrValidator) ? validatorsOrValidator : [validatorsOrValidator];
  return validators.map(validator => validator2ElemRule(validator, mixin));
}
export default validator2ElemRule;
