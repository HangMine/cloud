<template>
  <div class="over-text">
    <template v-if="isOver">
      <el-tooltip v-model="showTooltip" effect="light" :content="content" v-bind="$attrs">
        <div class="over-text-wrap" :style="wrapStyle" ref="wrap">
          <slot></slot>
        </div>
      </el-tooltip>
    </template>
    <template v-else>
      <div class="over-text-wrap" :style="wrapStyle" v-bind="$attrs" ref="wrap">
        <slot></slot>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, onMounted, getCurrentInstance, nextTick, watch,
} from 'vue';
import useResize from '@/utils/uses/use-resize';
import { ElTooltip } from 'element-plus';


export default defineComponent({
  name: 'over-text',
  inheritAttrs: false,
  components: { ElTooltip },
  props: {
    width: {
      type: [Number, String],
      default: 'auto',
    },
    resize: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const wrap = ref();

    const state = reactive({
      showTooltip: false,
      isOver: false,
      content: '',
      wrapStyle: {
        width: typeof props.width === 'string' ? props.width : `${props.width}px`,
      },
    });

    // const setSlotsElInline = () => {
    //   // 这里的refs.wrap已经是isOver的wrap
    //   const slotEls = [...wrap.value.children] as HTMLElement[];
    //   slotEls.forEach(el => {
    //     el.style.display = 'inline';
    //   });
    // };

    // 可能从外部调用,不能修改名字
    const init = async () => {
      console.log('over-text-init');
      const WrapEl = wrap.value as HTMLElement;
      if (WrapEl.scrollWidth > WrapEl.clientWidth) {
        state.isOver = true;
        state.content = WrapEl.textContent || '';

        await nextTick();
        // setSlotsElInline();
      } else {
        // 必须设置,有些场景可能从toolTip变成不需要toolTip
        state.isOver = false;
      }
    };

    // watch(() => state.showTooltip, (value) => {
    //   if (value) {
    //     init();
    //   }
    // });

    onMounted(async () => {
      await nextTick();
      init();
    });

    if (props.resize) {
      useResize(init, true);
    }

    return {
      ...toRefs(state),
      wrap,
      init,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.over-text {
  overflow: hidden;
}
.over-text-wrap {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  outline: none;
}
</style>
