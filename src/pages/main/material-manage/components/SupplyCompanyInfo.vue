<template>
  <div class="supply-info">
    <HForm :data="formData" :cols="1" v-model="params" ref="formVm"> </HForm>
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
import { fetchUserCompany, updateUserCompanyInfo } from '@/api/account';
import { getContextUser, updateContextUser } from '@/loaders/context';

const formData = [{
  key: 'name',
  title: '公司全称',
  rules: [{ required: true }],
}];

export default defineComponent({
  name: 'supply-info',
  dialogify: {
    props: {
      title: '完善信息',
      width: '430px',
    },
  },
  components: { HForm },
  props: {},
  setup(props, { emit }) {
    const formVm = ref<InstanceType<typeof HForm>>();
    const state = reactive({
      params: {} as Obj,
      companyInfo: {} as AsyncReturnType<typeof fetchUserCompany>,
    });
    const user = computed(() => getContextUser());


    const next = async () => {
      await formVm.value?.validate();
      await updateUserCompanyInfo({
        id: user.value?.companyId,
        name: state.params.name,
      });
      await updateContextUser({ companyName: state.params.name });
      emit('confirm');
    };

    return {
      ...toRefs(state), formVm, formData, next,
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
