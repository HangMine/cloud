<template>
  <el-select
    v-model="value"
    :placeholder="placeholder || `请选择${addressTypeEnum[type]}`"
    filterable
    clearable
    v-bind="$attrs"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="language === 'cn' ? item.fullZhName : item.fullEnName"
      :value="item.id"
    />
  </el-select>
</template>

<script lang="ts">

import { useI18n } from '@/components/sd-table/i18n';
import {
  defineComponent, reactive, toRefs, watch, PropType,
} from 'vue';
import {
  fetchCountryList, fetchProvinceList, fetchCityList, AddressItem,
} from '@/api/account';
import onCreated from '@/utils/vue/onCreated';

const addressRequest = {
  fetchCountryList, fetchProvinceList, fetchCityList,
};

enum addressTypeEnum {
  country = '国家',
  province = '省份',
  city = '城市',
}

export default defineComponent({
  name: 'address-item-select',
  inheritAttrs: false,
  props: {
    type: {
      type: String as PropType<keyof addressTypeEnum>,
      required: true,
    },
    parentId: {
      type: String,
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { language } = useI18n();
    const state = reactive({
      value: '',
      options: [],
    });
    const setOptions = async () => {
      const requestName = `fetch${props.type[0].toUpperCase()}${props.type.slice(1)}List` as keyof typeof addressRequest;
      const res: AddressItem[] = await addressRequest[requestName]({ parentIds: props.parentId ? [props.parentId] : undefined });
      state.options = res;
    };
    watch(() => props.modelValue, (value) => {
      state.value = value;
    }, { immediate: true });
    watch(() => state.value, (value) => {
      // 根据modelValue的类型设置update:modelValue的类型
      const modelValue = typeof value === 'string' ? `${value}` : +value;
      emit('update:modelValue', modelValue);
    });
    watch(() => props.parentId, async (value) => {
      if (value && props.type !== 'country') {
        await setOptions();
      }
    }, { immediate: true });

    onCreated(async () => {
      if (props.type === 'country') {
        await setOptions();
      }
    });
    return { ...toRefs(state), language, addressTypeEnum };
  },
});
</script>
