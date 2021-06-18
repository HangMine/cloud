<template>
  <div class="apply-sample">
    <div class="main">
      <el-form
        class="form-box flex-wrap"
        :model="receiverInfo"
        :rules="formRules"
        size="small"
        label-position="top"
        ref="formRef"
      >
        <el-form-item label="申请内容" prop="content">
          <el-input
            type="textarea"
            v-model="receiverInfo.content"
            placeholder="请输入申请内容"
            resize="none"
            rows="4"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="收件人姓名" prop="name">
          <el-input v-model="receiverInfo.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="收件人手机" prop="phone">
          <el-input v-model="receiverInfo.phone" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="收件人地址" prop="address">
          <DictionaryAddressSelector :modelValue="addressList"></DictionaryAddressSelector>
        </el-form-item>
        <el-form-item label="收件人详细地址" prop="addressDetail">
          <el-input v-model="receiverInfo.addressDetail" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button type="primary" @click="submit()">提 交</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import {
  defineComponent, reactive, toRefs, ref,
} from '@vue/runtime-core';
import { ElForm } from 'element-plus';

import DictionaryAddressSelector from '@/components/form/DictionaryAddressSelector.vue';
import { validator2ElemRules } from '@/utils/validators/utils/validator-to-elem-rule';
import validMobilePhone from '@/utils/validators/valid-mobile-phone';
import validFilled from '@/utils/validators/valid-filled';

type AddressList = [string | null, string | null, string | null];

export default defineComponent({
  name: '',
  dialogify: {
    props: {
      title: '申请样品',
      width: '500px',
      closeOnClickModal: false,
    },
  },
  components: {
    DictionaryAddressSelector,
  },
  props: {},
  setup() {
    const formRef = ref<InstanceType<typeof ElForm>>();

    const formRules = {
      name: validator2ElemRules([validFilled], { trigger: 'blur' }),
      content: validator2ElemRules([validFilled], { trigger: 'blur' }),

      phone: validator2ElemRules([validFilled, validMobilePhone], { trigger: 'blur' }),
      addressDetail: validator2ElemRules([validFilled], { trigger: 'blur' }),
    };

    const state = reactive({

      receiverInfo: {
        name: '',
        content: '',
        phone: '',
        address: '',
        addressDetail: '',
      },
      addressList: [null, null, null] as AddressList,

    });
    const submit = () => {
      formRef.value!.validate((valid) => {
        if (valid) {
          console.log(888);
        } else {
          console.log('error submit!!');
          return false;
        }
        return true;
      });
    };


    return {
      ...toRefs(state), formRules, formRef, submit,
    };
  },
});
</script>
<style lang="scss" scoped>
.apply-sample {
  .main {
    border-radius: 8px;

    // width: 500px;
    // background: #fff;
    .title {
      font-size: 16px;
    }
    .form-box {
      padding: 0 6px 14px;
      .el-form-item {
        width: 100%;
        /deep/ .el-form-item__label {
          padding-bottom: 0;
        }
      }
    }
  }
  .footer {
    text-align: right;
  }
}
</style>
