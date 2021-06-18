import { Validator } from '@/typings/validator.d';

type ErrorOutput<V extends Validator<any>> =
  ((error: Error, ...args:Parameters<V>) => any) | ((error: Error) => any);

function validator2Checker<
  V extends Validator<any>,
  S extends boolean = true,
  EO extends ErrorOutput<V> =(() => false)>(
  validatorsOrValidator: V | V[],
  sync: S = true as S,
  errorOutput: EO = (() => false) as unknown as EO) :
  ((...args: Parameters<V>) =>
  (S extends true ? ReturnType<EO> | true : Promise<ReturnType<EO> | true>)) {
  let validators: V[];
  if (!Array.isArray(validatorsOrValidator)) {
    validators = [validatorsOrValidator];
  } else {
    validators = validatorsOrValidator;
  }
  if (sync) {
    return (...args: Parameters<V>) => {
      try {
        for (let i = 0; i < validators.length; i++) {
          const validator = validators[i];

          // @ts-ignore
          validator(...args);
        }
        return true;
      } catch (e) {
        return errorOutput(e, ...args);
      }
    };
  }
  // @ts-ignore @see https://github.com/microsoft/TypeScript/issues/4742
  return async (...args: Parameters<V>) => {
    try {
      for (let i = 0; i < validators.length; i++) {
        const validator = validators[i];

        // @ts-ignore
        await validator(...args);
      }
      return true;
    } catch (e) {
      return errorOutput(e, ...args);
    }
  };
}
export { validator2Checker };
export default validator2Checker;
