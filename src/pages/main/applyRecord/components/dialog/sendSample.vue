<template>
  <div class="handle-apply">
    <div class="main">
      <el-form
        class="form-box flex-wrap"
        :model="receiverInfo"
        :rules="formRules"
        size="small"
        label-position="top"
        ref="formRef"
      >
        <div class="title receive-title">收件人信息</div>
        <el-form-item label="姓名" prop="creatorName">
          <el-input v-model="receiverInfo.creatorName" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="creatorPhone">
          <el-input v-model="receiverInfo.creatorPhone" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="detailAddress">
          <el-input v-model="receiverInfo.detailAddress" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="receiverInfo.address" disabled placeholder=""></el-input>
        </el-form-item>
        <div class="title send-title">寄样信息</div>
        <el-form-item label="寄件数量" prop="number">
          <el-input v-model="receiverInfo.number" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNumber">
          <el-input v-model="receiverInfo.logisticsNumber" placeholder=""></el-input>
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
  defineComponent, reactive, toRefs, ref, onMounted,
} from '@vue/runtime-core';
import { ElForm, ElMessage } from 'element-plus';
import {
  sendSample, getComponyInfo,
} from '@/api/applyRecord';
import {
  fetchCountryList, fetchProvinceList, fetchCityList,
} from '@/api/account';
import { validator2ElemRules } from '@/utils/validators/utils/validator-to-elem-rule';
import validFilled from '@/utils/validators/valid-filled';
import { getMatchedAddressCnText } from '@/utils/format-address';

type AddressList = [string, string, string];
export default defineComponent({
  name: '',
  components: {
  },
  props: {
    applyId: {
      type: String,
    },
    orgId: {
      type: String,
    },
  },
  dialogify: {
    props: {
      title: '同意申请',
      width: '500px',
      closeOnClickModal: false,
    },
  },
  emits: ['confirm'],
  setup(props, { emit }) {
    const formRef = ref<InstanceType<typeof ElForm>>();
    const formRules = {
      number: validator2ElemRules([validFilled], { trigger: 'blur' }),
      logisticsNumber: validator2ElemRules([validFilled], { trigger: 'blur' }),
    };
    const state = reactive({
      receiverInfo: {
        creatorName: '',
        creatorPhone: '',
        detailAddress: '',
        address: '',
        logisticsNumber: '',
        number: '',
      },
    });
    onMounted(async () => {
      const res = await getComponyInfo(props.orgId);
      state.receiverInfo.creatorName = res.creatorName;
      state.receiverInfo.creatorPhone = res.creatorPhone;
      state.receiverInfo.address = res.address;
      state.receiverInfo.detailAddress = await getMatchedAddressCnText([res.addressCountry, res.addressProvince, res.addressCity]);
    });
    const submit = () => {
      formRef.value!.validate(async (valid) => {
        if (valid) {
          await sendSample({
            applyId: props.applyId as string, number: state.receiverInfo.number, logisticsNumber: state.receiverInfo.logisticsNumber,
          });
          await ElMessage.success('已同意');
          emit('confirm');
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
.handle-apply {
  .main {
    border-radius: 8px;
    .title {
      font-size: 16px;
      font-weight: 600;
    }
    .receive-title {
      margin-bottom: 12px;
    }
    .send-title {
      margin: 12px 0;
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
