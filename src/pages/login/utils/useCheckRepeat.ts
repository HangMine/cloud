import i18n from '@/i18n';
import {
  reactive, toRefs,
} from 'vue';
import * as api from '@/api/account';
import { ElForm } from 'element-plus';

const useCheckRepeat = (formVm: Ref<typeof ElForm>, account: Ref<string>, prop = 'account') => {
  const state = reactive({
    repeatError: undefined as string | undefined,
  });
  const handleBlur = async () => {
    formVm.value?.validateField(prop, async (msg: string) => {
      if (!msg) {
        const res = await api.duplicate({ account: account.value });
        if (res.data === true) {
          // 有重复
          state.repeatError = i18n.t('public.error.repeat_account');
        }
      }
    });
  };
  const handleFocus = () => {
    state.repeatError = undefined;
  };
  return {
    ...toRefs(state), handleBlur, handleFocus,
  };
};

export default useCheckRepeat;
