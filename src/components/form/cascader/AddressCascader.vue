<template>
  <SdCascader
    :fetchFn="cascaderFetchFn"
    placeholder="请选择所在地"
    class="address-cascader"
    v-bind="$attrs"
    filterable
    clearable
  ></SdCascader>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';
import {
  fetchCountryList, fetchProvinceList, fetchCityList, fetchDistrictList, AddressItem,
} from '@/api/account';
import SdCascader, { CascaderNode } from './index';

const addressRequest = {
  fetchCountryList, fetchProvinceList, fetchCityList, fetchDistrictList,
};

export default defineComponent({
  name: 'address-cascader',
  inheritAttrs: false,
  components: { SdCascader },
  props: {
    modelValue: {
      type: [String, Number],
      default: 1, // 默认是数字类型
    },
  },
  emits: ['update:modelValue'],
  setup() {
    const levelTypeMap: { [propName: string]: string } = {
      1: 'country',
      2: 'province',
      3: 'city',
      4: 'district',
    };
    const getAddressList = async (type: valueof<typeof levelTypeMap>, parentId: string, isLeaf: boolean) => {
      const requestName = `fetch${type[0].toUpperCase()}${type.slice(1)}List` as keyof typeof addressRequest;
      const res: AddressItem[] = await addressRequest[requestName]({ parentIds: [parentId] });
      return res.map(item => ({
        id: item.id,
        value: item.id,
        label: item.fullZhName,
        leaf: isLeaf,
      }));
    };

    const cascaderFetchFn = async (node: CascaderNode) => {
      const { level, value } = node;
      const levelType = levelTypeMap[level + 1];
      const list = await getAddressList(levelType, value, level >= 2);
      return list;
    };

    return {
      cascaderFetchFn,
    };
  },
});
</script>
<style lang="scss">
.address-cascader {
  width: 100%;
}
</style>
