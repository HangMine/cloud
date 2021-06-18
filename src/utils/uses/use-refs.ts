import {
  onBeforeUpdate,
  reactive, ref, toRefs,
} from 'vue';

const useRefs = <T>() => {
  const vms = ref<T[]>([]);
  const handleRef = (vm: T | null) => {
    if (vm) vms.value.push(vm);
  };
  // 确保在每次更新之前重置ref
  onBeforeUpdate(() => {
    vms.value = [];
  });
  return {
    handleRef, vms,
  };
};

export default useRefs;
