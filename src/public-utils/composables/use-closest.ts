import { computed, getCurrentInstance } from '@vue/composition-api';
import Vue, { VueConstructor } from 'vue';
import { closest } from '../plugins/vue-closest';
// import { InstanceOfVue } from '@/typings/vue-types.d';

export function useClosest<
  C extends VueConstructor = VueConstructor,
  Required extends boolean = false>(
  componentName: string,
) {
  const that = getCurrentInstance() as unknown as Vue;
  return computed(() => {
    if (!that) {
      return undefined as Required extends true ? InstanceType<C> : undefined;
    }
    return closest.call(that, componentName) as InstanceType<C>;
  });
}
export default useClosest;
