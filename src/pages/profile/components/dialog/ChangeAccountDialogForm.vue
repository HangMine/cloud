<template>
  <el-form :model="formData" size="small" ref="formVm">
    <el-form-item label="现用手机号/邮箱" class="label-text-fade">
      {{ currentAccount }}
    </el-form-item>
    <Account
      prop="newAccount"
      v-model="formData.newAccount"
      label="新邮箱/手机号"
      @blur="handleBlur"
      @focus="handleFocus"
      :error="repeatError"
    ></Account>
    <Password
      prop="pw"
      v-model="formData.pw"
      label="登录密码"
      autocomplete="new-password"
      :rules="complexPwRule"
    ></Password>
    <IdentCode
      v-model="formData.code"
      label="验证码"
      class="form-item-ident-code"
      :disabled="disabled"
      type="RESET_EMAIL"
      :account="formData.newAccount"
      autocomplete="new-password"
      ref="codeVm"
    ></IdentCode>
    <div class="dialog-footer flex-justify-flex-end">
      <el-button @click="cancelForm">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-form>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRef, toRefs, ref, watch,
} from 'vue';
import Account from '@/pages/login/components/inputs/Account.vue';
import Password, { complexPwRule } from '@/pages/login/components/inputs/Password.vue';
import IdentCode from '@/pages/login/components/inputs/IdentCode.vue';
import { validateForm } from '@/utils/validators/validate-form';
import { ElForm } from 'element-plus';
import useCheckRepeat from '@/pages/login/utils/useCheckRepeat';
import useCode from '@/pages/login/utils/useCode';
import { updateAccount } from '@/api/account';
import { updateContextUser } from '@/loaders/context';

export default defineComponent({
  components: {
    Password,
    Account,
    IdentCode,
  },
  props: {
    currentAccount: {
      default: String,
      required: true,
    },
  },
  dialogify: {
    props: {
      title: '修改绑定邮箱/手机',
      width: '430px',
    },
  },
  emits: ['blur', 'focus', 'cancel', 'confirm'],
  setup(props, { emit }) {
    const formVm = ref<typeof ElForm>();
    const state = reactive({
      formData: {
        account: props.currentAccount,
        newAccount: '',
        pw: '',
        code: '',
        platform: '2',
      },
    });
    const { repeatError, handleBlur, handleFocus } = useCheckRepeat(formVm, toRef(state.formData, 'newAccount'), 'newAccount');
    const { disabled } = useCode(toRef(state.formData, 'newAccount'));

    const cancelForm = async () => {
      emit('cancel');
    };
    const submitForm = async () => {
      await validateForm(formVm.value!);
      await updateAccount(state.formData);
      await updateContextUser({ account: state.formData.newAccount });
      emit('confirm');
    };


    return {
      ...toRefs(state),
      disabled,
      formVm,
      submitForm,
      cancelForm,
      complexPwRule,
      repeatError,
      handleBlur,
      handleFocus,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: 20px;
}
.label-text-fade {
  /deep/ .el-form-item__label {
    color: #666;
    padding-right: 8px;
  }
  /deep/ .el-form-item__content {
    color: #222;
  }
}
.form-item-ident-code {
  /deep/ .el-form-item__content {
    .flex {
      width: 100%;
    }
    .ident-code-input {
      padding-right: 0;
    }
    .ident-code-btn {
      position: static;
      /*white-space: nowrap;*/
      border: 1px solid #dddddd;
      border-radius: 5px;
      line-height: 30px;
      margin-left: 8px;
      width: 104px;
      flex-shrink: 0;
      text-align: center;
    }
  }
}
</style>
