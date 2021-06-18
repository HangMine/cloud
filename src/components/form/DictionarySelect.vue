<template>
  <el-select v-model="value" class="dictionary-select" v-bind="$attrs" @change="handleChange">
    <el-option v-for="item of options" :key="item.itemValue" :label="item.label" :value="item.itemValue" />
  </el-select>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch,
} from 'vue';
import { getDictionaryByTypeCode } from '@/api/dictionary';
import onCreated from '@/utils/vue/onCreated';
// import i18n from '@/i18n';

interface Dictionary {
  itemValue: number | string,
  label: string,
}

type Options = Dictionary[];


export default defineComponent({
  name: 'dictionary-select',
  inheritAttrs: false,
  components: {},
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: 1, // 默认是数字类型
    },
    type: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, attrs }) {
    const state = reactive({
      value: 1 as typeof props.modelValue,
      options: [] as Options,
    });
    watch(() => props.modelValue, (value) => {
      state.value = value;
    }, { immediate: true });
    watch(() => state.value, (value) => {
      // eslint-disable-next-line no-nested-ternary
      const modelValue = attrs.multiple ? value : typeof value === 'string' ? `${value}` : +value;
      emit('update:modelValue', modelValue);
    });

    const fetchOptions = async () => {
      const res: Options = (await getDictionaryByTypeCode(
        props.type,
        // i18n.language,
      )).data || [];
      state.options = res.map(item => ({ ...item, ...{ itemValue: String(item.itemValue) } }));
    };

    const handleChange = (val: typeof props.modelValue) => {
      emit('change', val);
    };
    onCreated(() => fetchOptions());

    return {
      ...toRefs(state),
      handleChange,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.dictionary-select {
}
</style>
