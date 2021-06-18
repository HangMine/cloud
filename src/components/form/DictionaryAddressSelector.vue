<template>
  <div class="flex">
    <el-select
      v-model="val.value"
      :placeholder="`请选择${val.typeCnText}`"
      filterable
      :clearable="index === 2"
      :disabled="disabledItem(index)"
      v-bind="$attrs"
      v-for="(val, index) in configArr"
      :key="index"
      @change="handleItemChange(index, $event)"
    >
      <el-option v-for="item in val.options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script lang="ts">

// import { useI18n } from '@/i18n';
// import { getCountryList } from '@/api/dictionary';
import {
  defineComponent, reactive, toRefs, watch, PropType,
} from 'vue';
import {
  fetchCountryList, fetchProvinceList, fetchCityList, AddressItem,
} from '@/api/account';
import onCreated from '@/utils/vue/onCreated';
// const levelTypeMap: { [propName: string]: string } = {
//   0: 'country',
//   1: 'province',
//   2: 'city',
//   3: 'district',
// };
type addressConfigItem = {
  type: string,
  value: string,
  typeCnText: string,
  options: {
    id: string,
    value: string,
    label: string,
  }[]
};
const addressRequest = {
  fetchCountryList, fetchProvinceList, fetchCityList,
};

export default defineComponent({
  name: 'country-select',
  inheritAttrs: false,
  props: {
    modelValue: {
      required: true,
      type: Array,
      validator(val: string[]) {
        return val.length === 3;
      },
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    // const { language } = useI18n();
    const configArr = reactive([
      {
        type: 'country',
        value: '',
        typeCnText: '国家',
        options: [],
      },
      {
        type: 'province',
        value: '',
        typeCnText: '省份',
        options: [],

      },
      {
        type: 'city',
        value: '',
        typeCnText: '城市',
        options: [],
      },
    ]) as addressConfigItem[];
    const fetchChildrenAddressList = async (index: number, parentId?: string) => {
      const requestType = configArr[index].type;
      const requestName = `fetch${requestType[0].toUpperCase()}${requestType.slice(1)}List` as keyof typeof addressRequest;
      const res: AddressItem[] = await addressRequest[requestName]({ parentIds: parentId ? [parentId] : undefined });
      configArr[index].options = res.map(item => ({
        id: item.id,
        value: item.id,
        label: item.fullZhName,
      }));
    };

    const handleItemChange = async (index: number, parentId?: string) => {
      if (index === 2) {
        if (!parentId) {
          configArr.forEach(item => {
            item.value = '';
          });
        }
        emit('change', [configArr[0].value, configArr[1].value, configArr[2].value]);
        return;
      }
      configArr.slice(index + 1).forEach(item => {
        item.value = '';
      });
      fetchChildrenAddressList(index + 1, parentId);
    };


    const disabledItem = (index: number) => {
      if (index === 0) return false;
      return !configArr[index - 1].value;
    };

    watch(() => props.modelValue, (value) => {
      if (!Array.isArray(value) || value.length !== 3) {
        return;
      }
      [configArr[0].value, configArr[1].value, configArr[2].value] = value;
      if (configArr[0].value && configArr[1].options.length === 0) {
        fetchChildrenAddressList(1, configArr[0].value);
      }
      if (configArr[1].value && configArr[2].options.length === 0) {
        fetchChildrenAddressList(2, configArr[1].value);
      }
    });

    onCreated(() => fetchChildrenAddressList(0));

    return {
      configArr, fetchChildrenAddressList, disabledItem, handleItemChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-select + .el-select {
  margin-left: 10px;
}
</style>
