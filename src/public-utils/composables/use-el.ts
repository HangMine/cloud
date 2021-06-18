import {
  onMounted, ref, Ref, getCurrentInstance,
} from '@vue/composition-api';

export function useEl<E extends HTMLElement>(): Ref<E | null> {
  const el = ref(null as any);
  const that = getCurrentInstance() as unknown as Vue;
  onMounted(() => {
    // el.value = new HTMLElement();
    el.value = that?.$el;
  });
  return el;
}
export default useEl;
