<template>
  <div class="input-tag-wrap" @click="handleClickWrap">
    <span class="tag-item" v-for="(tag, i) of tags" :key="i">
      {{ tag }} <i class="close-icon el-icon-close" @click.stop="delTag(i)"></i>
    </span>
    <input
      v-model="inputValue"
      class="input-tag"
      @keydown.enter="handleEnter"
      @blur="handleBlur"
      v-bind="$attrs"
      ref="inputVm"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, watch,
} from 'vue';

export default defineComponent({
  name: 'input-tag',
  inheritAttrs: false,
  components: {},
  props: {
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    addTagOnBlur: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputVm = ref<HTMLInputElement>();
    const state = reactive({
      tags: [] as typeof props.modelValue,
      inputValue: '',
    });
    watch(() => props.modelValue, (value) => {
      state.tags = value;
    }, { immediate: true });
    watch(() => state.tags, (value) => {
      // 根据modelValue的类型设置update:modelValue的类型
      emit('update:modelValue', value);
    }, { deep: true });
    const addTag = () => {
      if (!state.inputValue) return;
      if (state.tags.includes(state.inputValue)) return;
      state.tags = [...new Set([...state.tags, state.inputValue])];
      state.inputValue = '';
    };

    const handleEnter = () => {
      addTag();
    };

    const delTag = (i: number) => {
      state.tags.splice(i, 1);
    };
    const handleClickWrap = () => {
      inputVm.value?.focus();
    };
    const handleBlur = () => {
      addTag();
      state.inputValue = '';
    };
    return {
      ...toRefs(state), handleEnter, delTag, inputVm, handleClickWrap, handleBlur,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.input-tag-wrap {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 4px 6px 2px 6px;
  text-align: left;
  cursor: text;
  height: 32px;
  .tag-item {
    display: inline-block;
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 4px;
    margin-right: 4px;
    line-height: 20px;
    height: 20px;
    padding: 0 6px;
    background-color: #000;
    opacity: 0.35;
    color: #fff;
    border: none;
    border-radius: 12px;
    .close-icon {
      cursor: pointer;
      color: #969696;
      font-size: 12px;
      font-weight: 700;
    }
  }
  .input-tag {
    flex-grow: 1;
    border: none;
    outline: none;
    color: #777;
    &::placeholder {
      color: #ccc;
      font-size: 13px;
    }
  }
}
</style>
