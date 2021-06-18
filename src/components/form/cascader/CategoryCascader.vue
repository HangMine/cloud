<template>
  <SdCascader
    :fetchFn="cascaderFetchFn"
    placeholder="全部材料类型"
    class="catergory-cascader"
    v-bind="$attrs"
  ></SdCascader>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, onMounted,
} from 'vue';
import { fetchMaterial, fetchMaterialList, fetchChildCategory } from '@/api/material';
import SdCascader, { CascaderNode, CascaderNodes } from './index';

export default defineComponent({
  name: 'catergory-cascader',
  inheritAttrs: false,
  components: { SdCascader },
  props: {},
  setup(props, { emit }) {
    const state = reactive({});
    const cascaderFetchFn = async (node: CascaderNode) => {
      const res = (await fetchChildCategory({ pId: node.value || '-1' })).data;
      return res.map(item => ({
        level: node.level + 1,
        value: item.id,
        label: item.name,
        leaf: !item.hasChild,
      }));
    };
    return {
      ...toRefs(state), cascaderFetchFn,
    };
  },
});
</script>
<style lang="scss" >
// @import 'url'
.catergory-cascader {
  .el-input__inner {
    &::placeholder {
      color: #606266 !important;
    }
  }
}
</style>
