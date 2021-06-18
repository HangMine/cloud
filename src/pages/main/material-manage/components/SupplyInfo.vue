<template>
  <div class="supply-info">
    <HForm :data="formData" :cols="1" v-model="params" ref="formVm">
      <template #businessModel>
        <DictionarySelect
          type="businessModel"
          v-model="params.businessModel"
          clearable
          placeholder="请输入经营模式"
        ></DictionarySelect>
      </template>
      <template #leadingProduct>
        <DictionarySelect
          type="leadingProduct"
          v-model="params.leadingProduct"
          clearable
          :multiple="true"
          placeholder="请选择主营产品"
        ></DictionarySelect>
      </template>
      <template #address>
        <DictionaryAddressSelector
          :modelValue="params.address"
          @change="handleAddressChange"
          ref="addressSelectorVm"
        ></DictionaryAddressSelector>
        <!-- <AddressCascader @change="handleAddressChange"></AddressCascader> -->
      </template>
    </HForm>
    <div class="footer">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import HForm from '@/components/form/HForm/index.vue';
import * as accountApi from '@/api/account';
import DictionarySelect from '@/components/form/DictionarySelect.vue';
import DictionaryAddressSelector from '@/components/form/DictionaryAddressSelector.vue';
import { updateContextUser } from '@/loaders/context';
import { fetchUserCompany } from '@/api/account';
import onCreated from '@/utils/vue/onCreated';

export default defineComponent({
  name: 'supply-info',
  dialogify: {
    props: {
      title: '完善信息',
      width: '430px',
    },
  },
  components: { HForm, DictionaryAddressSelector, DictionarySelect },
  props: {},
  setup(props, { emit }) {
    const addressSelectorVm = ref<InstanceType<typeof DictionaryAddressSelector>>();
    const formVm = ref<InstanceType<typeof HForm>>();
    const state = reactive({
      params: {
        name: '',
        businessModel: '',
        leadingProduct: '',
        address: [],
      } as Obj,
      needValidate: false, // 为了校验所在地
    });

    const formData = [{
      key: 'name',
      title: '公司全称',
      rules: [{ required: true }],
    }, {
      key: 'businessModel',
      title: '经营模式',
      rules: [{ required: true }],
    }, {
      key: 'leadingProduct',
      title: '主营产品',
      rules: [{ required: true }],
      value: [],
    }, {
      key: 'address',
      title: '所在地',
      value: [],
      rules: [{
        trigger: 'change',
        required: true,
        validator: (_: unknown, __: unknown, callback: Function) => {
          if (!state.needValidate) return;
          const hasValue = state.params.address.every((item: string) => item);
          if (!hasValue) {
            callback(new Error('不能为空'));
          } else {
            callback();
          }
        },
      }],
    }];

    const handleAddressChange = (addressList: string[]) => {
      state.params.address = addressList;
    };

    const params2apiParams = () => {
      let {
        name, businessModel, leadingProduct,
      } = state.params;
      if (Array.isArray(leadingProduct)) {
        leadingProduct = leadingProduct.join(',');
      }
      const [addressCountry, addressProvince, addressCity] = state.params.address;
      return {
        name,
        businessModel,
        leadingProduct,
        addressCountry,
        addressProvince,
        addressCity,
      };
    };
    const next = async () => {
      state.needValidate = true;
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await formVm.value?.validate();
      state.needValidate = false;
      const apiParams = params2apiParams();
      await accountApi.improveAccount(apiParams);
      await updateContextUser();
      emit('confirm');
    };
    const getCompanyInfo = async () => {
      const res = await fetchUserCompany();
      state.params.name = res.name;
      state.params.businessModel = res.businessModel;
      state.params.leadingProduct = res.leadingProduct ? (res.leadingProduct as string).split(',') : [];
      state.params.address = [res.addressCountry, res.addressProvince, res.addressCity];
    };
    onCreated(() => getCompanyInfo());

    return {
      ...toRefs(state), addressSelectorVm, formVm, handleAddressChange, formData, next,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.supply-info {
  .footer {
    text-align: right;
  }
}
</style>
