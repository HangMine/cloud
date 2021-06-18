import {
  reactive, toRefs, onMounted, SetupContext, nextTick, ref, ComponentPublicInstance,
} from 'vue';
import { getPx } from '../utils';

type MaxHeight = boolean | number | string | undefined;


const useMaxHeight = (maxHeight: MaxHeight = true) => {
  const tableVm = ref<ComponentPublicInstance>();
  const state = reactive({
    currentMaxHeight: undefined as MaxHeight,
  });

  let HAS_SET_TABLE_HEIGHT = false;

  onMounted(async () => {
    if (maxHeight === false) return;
    if (maxHeight !== true) {
      state.currentMaxHeight = getPx(maxHeight!);
      return;
    }
    if (!HAS_SET_TABLE_HEIGHT && tableVm.value) {
      HAS_SET_TABLE_HEIGHT = true; // 只执行一次
      // 必须添加nextTick,否则不出高度
      await nextTick();
      const winHei = document.documentElement.clientHeight;
      const tableOffsetTop = tableVm.value.$el.getBoundingClientRect().top;
      const paginationHeight = 82;
      const paddingBottom = 20;
      const pcHeight = winHei - tableOffsetTop - paginationHeight - paddingBottom;
      state.currentMaxHeight = pcHeight;
    }
  });
  return {
    tableVm,
    ...toRefs(state),
  };
};

export default useMaxHeight;
