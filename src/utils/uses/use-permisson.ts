import { getContextUser } from '@/loaders/context';
import {
  computed,
  reactive, toRefs,
} from 'vue';

const usePermisson = () => {
  const state = reactive({});
  const user = computed(() => getContextUser());
  const isSupplier = computed(() => user.value?.type === 11);
  const isBuyer = computed(() => user.value?.type === 12);
  return {
    ...toRefs(state), user, isSupplier, isBuyer,
  };
};

export default usePermisson;
