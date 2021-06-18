<template>
  <div class="steps">
    <slot></slot>
    <div class="bar empty"></div>
    <div class="bar process" :style="processStyle"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, provide,
} from 'vue';

export default defineComponent({
  name: 'steps',
  components: {

  },
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const stepStates = ref([]);
    const step = ref(0);
    provide('steps', { step, stepStates });
    watch(() => props.modelValue, (value) => {
      step.value = value;
    }, { immediate: true });

    watch(step, (value) => {
      // 根据modelValue的类型设置update:modelValue的类型
      const modelValue = typeof value === 'string' ? `${value}` : +value;
      emit('update:modelValue', modelValue);
    });


    const process = computed(() => (Math.round((step.value / (stepStates.value.length - 1)) * 100)));
    const processStyle = computed(() => {
      return {
        width: `${process.value}%`,
      };
    });
    return {
      step, stepStates, processStyle,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  .bar {
    position: absolute;
    left: 0;
    top: 7px;
    height: 2px;
    width: 100%;
    transition: width 0.3s;
    &.empty {
      background-color: #eeeeee;
    }
    &.process {
      background-color: $color-primary;
    }
  }
}
</style>
