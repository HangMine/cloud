<template>
  <div class="flex input-with-unit">
    <el-input class="main-form-item" v-model="currentModelValue" clearable :placeholder="placeholder"> </el-input>
    <el-select class="append-form-item" v-model="currentUnit">
      <el-option
        v-for="option in unitOptions"
        :key="option[labelKey]"
        :label="option[labelKey]"
        :value="option[valueKey]"
      ></el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import {
  defineComponent, reactive, watch, PropType, toRefs,
} from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
    },
    unitOptions: {
      type: Array as PropType<{ [key: string]: any }[]>,
      required: true,
    },
    labelKey: {
      type: String,
      default: 'title',
    },
    valueKey: {
      type: String,
      default: 'key',
    },
  },
  emits: ['update:modelValue', 'update:unit'],
  setup(props, { emit }) {
    const state = reactive({
      currentModelValue: props.modelValue,
      currentUnit: props.unit,
    });
    ['modelValue', 'unit'].forEach((propKey) => {
      const stateKey = `current${propKey[0].toUpperCase() + propKey.slice(1)}`;
      watch(() => props[propKey], (val) => {
        state[stateKey] = val;
      });
      watch(() => state[stateKey], (val) => {
        emit(`update:${propKey}`, val);
      });
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.input-with-unit {
  width: 100%;
  .main-form-item {
    flex: 1;
  }
  .append-form-item {
    width: 100px;
    padding-left: 6px;
  }
}
</style>
