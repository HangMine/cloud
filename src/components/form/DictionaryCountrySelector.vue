<template>
  <el-select v-model="value" :placeholder="$t('login.country_palceholder')" filterable clearable v-bind="$attrs">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="language === 'cn' ? item.name : item.usName"
      :value="item.id"
    />
  </el-select>
</template>

<script lang="ts">

import { useI18n } from '@/i18n';
import { getCountryList } from '@/api/dictionary';
import {
  defineComponent, reactive, toRefs, watch,
} from 'vue';

export default defineComponent({
  name: 'country-select',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { language } = useI18n();
    const state = reactive({
      value: '',
      options: [],
    });
    watch(() => props.modelValue, (value) => {
      state.value = value;
    }, { immediate: true });
    watch(() => state.value, (value) => {
      // 根据modelValue的类型设置update:modelValue的类型
      const modelValue = typeof value === 'string' ? `${value}` : +value;
      emit('update:modelValue', modelValue);
    });
    const setOptions = async () => {
      state.options = (await getCountryList()).data;
    };
    setOptions();
    return { ...toRefs(state), language };
  },
});
</script>
