import {
  reactive, toRefs, Ref, watch,
} from 'vue';
import validAccount from '@/utils/validators/valid-account';

const useCode = (refCode: Ref<string>) => {
  const state = reactive({
    disabled: true,
  });
  watch(refCode, () => {
    try {
      validAccount(refCode.value);
      state.disabled = false;
    } catch (error) {
      state.disabled = true;
    }
  });
  return {
    ...toRefs(state),
  };
};

export default useCode;
