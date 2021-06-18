import { validator2ElemRules } from '@/utils/validators/utils/validator-to-elem-rule';
import validFilled from '@/utils/validators/valid-filled';
import {
  reactive, Ref, toRefs,
} from 'vue';

const useRepeatPwRule = (refPw: Ref<string>) => {
  const repeatValidator = (repeatPw: string) => {
    if (repeatPw !== refPw.value) {
      throw new Error('密码不一致');
    }
  };
  const repeatRule = validator2ElemRules([validFilled, repeatValidator], { trigger: 'blur' });
  return repeatRule;
};

export default useRepeatPwRule;
