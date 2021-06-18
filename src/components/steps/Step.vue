<template>
  <div class="step" :class="{ 'is-done': isDone, 'is-current': isCurrent }">
    <div class="round-wrap" :style="roundWrapStyle">
      <i class="round"></i>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, inject, watch, Ref,
} from 'vue';

const defaultState = {
  index: 0,
};

interface StepsProvide {
  step: Ref<number>,
  stepStates: Ref<typeof defaultState[]>
}

export default defineComponent({
  name: 'step',
  components: {},
  props: {},
  setup(props, { emit }) {
    const { step, stepStates }: StepsProvide = inject('steps')!;
    const state = reactive({ ...defaultState, index: stepStates.value.length });
    const isFirst = computed(() => state.index === 0);
    const isLast = computed(() => state.index === stepStates.value.length - 1);
    const isDone = computed(() => state.index < step.value);
    const isCurrent = computed(() => state.index === step.value);
    const roundWrapStyle = computed(() => ({
      // eslint-disable-next-line no-nested-ternary
      textAlign: isFirst.value ? 'left' : isLast.value ? 'right' : 'center',
    }));
    stepStates.value = [...stepStates.value, state];
    return {
      ...toRefs(state), roundWrapStyle, isDone, isCurrent,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.step {
  z-index: 1;
  display: inline-block;
  color: #999999;
  &.is-done,
  &.is-current {
    color: #222222;
    .round-wrap {
      .round {
        border-color: $color-primary;
      }
    }
  }
  &.is-done {
    .round-wrap {
      .round {
        background-color: $color-primary;
        position: relative;
        &::after {
          content: "";
          width: 3px;
          height: 6px;
          transform: rotate(45deg);
          border: 2px solid white;
          position: absolute;
          left: 3px;
          top: 1px;
          border-top: none;
          border-left: none;
        }
      }
    }
  }
  .round-wrap {
    text-align: center;

    .round {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #eeeeee;
      border-radius: 50%;
      background-color: white;
      &.is-active {
        border-color: $color-primary;
      }
    }
  }
}
</style>
