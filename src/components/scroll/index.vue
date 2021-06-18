
<template>
  <div class="h-scroll" :style="scrollStyle" @scroll="onScroll" ref="scrollEl">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { getPx, getEl } from '@/utils/util';
import {
  computed, nextTick, PropType, reactive, watch, ref, toRefs,
} from 'vue';
// import { throttle } from '@utils/common';
export default {
  name: 'h-scroll',
  props: {
    to: {
      type: [Number, String],
      // 不能有默认值，否则当先通过el跳转后，再输入0时，由于to原本就是0，不触发to的函数
    },
    el: {
      type: [String, Object] as PropType<string | HTMLElement>,
      default: '',
    },
    // 滚动持续时长，单位ms
    transition: {
      type: Number,
      default: 200,
    },
    height: {
      tyep: [Number, String],
      // 默认继承父元素高度
      default: '100%',
    },
  },
  emits: ['scroll', 'scroll-end'],
  setup(props, { emit }) {
    const scrollEl = ref<HTMLDivElement>();
    type Target = typeof props.el | typeof props.to;
    const state = reactive({
      currentTo: 0,
      currentEl: '',
      scrollTop: 0,
      // 最大滚动距离
      maxScroll: 0,
      // throttleScroll: throttle(this.onScroll, 200)
    });

    const scrollStyle = computed(() => ({
      height: getPx(props.height),
    }));

    // 获取最终滚动的高度
    const getScrollTop = (val: Target) => {
      let scrollTop = 0;
      if (typeof val === 'string' || val instanceof HTMLElement) {
        const el = getEl(props.el);
        if (el) scrollTop = el.offsetTop;
      } else if (typeof val === 'number') {
        scrollTop = val;
      }
      return scrollTop;
    };

    // 设置可滚动最大距离
    const getMaxScroll = () => {
      const maxScroll = (scrollEl.value?.scrollHeight || 0) - (scrollEl.value?.clientHeight || 0);
      return maxScroll;
    };

    // 滚动结束
    const scrollEnd = async () => {
      await nextTick();
      emit('scroll-end', state.scrollTop);
    };

    // 滚动动画
    const animate = ({ el, start = 0, end = 0 }: { el: HTMLElement, start: number, end: number }) => {
      const isDown = end > start;
      let range = Math.abs(end - start);
      const step = Math.round((Math.abs(range / 60) * (1 / (props.transition / 1000))));

      const go = () => {
        if (isDown) {
          // 向下滚动
          start += step;
          if (start > end) {
            start = end;
          }
        } else {
          // 向上滚动
          start -= step;
          if (start < end) {
            start = end;
          }
          if (start < 0) {
            start = 0;
          }
        }
        el.scrollTop = start;
        state.scrollTop = start;
        range -= step;
        if (range > 0) {
          requestAnimationFrame(go);
        } else {
          scrollEnd();
        }
      };

      go();
    };

    // 滚动主函数
    const scrollTo = (target: Target) => {
      const start = state.scrollTop;
      const el = scrollEl.value!;
      // 不能超过可滚动最大距离
      const end = Math.min(getScrollTop(target), getMaxScroll());
      animate({ el, start, end });
    };

    const onScroll = (e: Event) => {
      const { scrollTop } = e.target as HTMLElement;
      state.scrollTop = scrollTop;
    };

    watch(() => props.to, (val) => {
      if (!val && val !== 0) return;
      scrollTo(val);
    });

    watch(() => props.el, (val) => {
      if (!val) return;
      scrollTo(val);
    });

    watch(() => state.scrollTop, (val) => {
      emit('scroll', val);
    });


    return {
      ...toRefs(state), scrollEl, scrollStyle, onScroll,
    };
  },


};
</script>
<style lang="scss">
/* @import 'url'; */
.h-scroll {
  overflow: auto;
  position: relative;
}
</style>
