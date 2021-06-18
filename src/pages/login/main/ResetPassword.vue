<template>
  <main class="comp-main">
    <div class="reset-password">
      <img :src="require('@/assets/img/login/logo-register.png')" class="login-logo" />
      <h3 class="login-title">{{ computedState.title }}</h3>
      <el-form :model="form" @submit.prevent ref="formVm">
        <Account
          v-if="type === 'bind'"
          v-model="form.account"
          @blur="handleBlur"
          @focus="handleFocus"
          :error="repeatError"
        ></Account>
        <Account v-else v-model="form.account"></Account>
        <Password
          v-model="form.password"
          placeholder="密码"
          autocomplete="new-password"
          :rules="complexPwRule"
        ></Password>
        <Password
          v-model="form.repeatPassword"
          :placeholder="computedState.repeatPasswordTitle"
          autocomplete="new-password"
          :rules="repeatPwRule"
        ></Password>
        <IdentCode
          v-model="form.code"
          :disabled="disabled"
          :type="computedState.codeType"
          :account="form.account"
          autocomplete="new-password"
          ref="codeVm"
        ></IdentCode>
        <div v-if="type === 'bind'" class="agree">
          <Agree v-model="hasAgree"></Agree>
        </div>
        <el-button class="login-btn" type="primary" :disabled="type === 'bind' && !hasAgree" @click="resetPassword">{{
          computedState.btnTitle
        }}</el-button>
        <p v-if="type === 'reset'" class="footer-link">
          <span class="text-link" @click="toRegister">注册</span>
          <el-divider direction="vertical"></el-divider>
          <span class="text-link" @click="toLogin">登录</span>
        </p>
      </el-form>
    </div>
  </main>
</template>

<script lang="ts">
import { validateForm } from '@/utils/validators/validate-form';
import {
  defineComponent, reactive, computed, ref, toRefs, toRef, PropType, onMounted,
} from 'vue';
import * as api from '@/api/account';
import { ElForm, ElMessage } from 'element-plus';
import openWindow from '@/utils/open-window';
import i18n from '@/i18n';
import useCode from '../utils/useCode';
import {
  accountType, handleLogined, loading, mainComponent, qrcodeScene,
} from '../utils/loginStore';
import IdentCode from '../components/inputs/IdentCode.vue';
import Account from '../components/inputs/Account.vue';
import Password, { complexPwRule } from '../components/inputs/Password.vue';
import Agree from '../components/Agree.vue';
import useRepeatPwRule from '../utils/useRepeatPwRule';
import useCheckRepeat from '../utils/useCheckRepeat';

export default defineComponent({
  name: 'reset-password',
  components: {
    Account, IdentCode, Password, Agree,
  },
  props: {
    type: {
      type: String as PropType<'reset' | 'bind'>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const formVm = ref<typeof ElForm>();
    const codeVm = ref<InstanceType<typeof IdentCode>>();

    const state = reactive({
      form: {
        account: '',
        password: '',
        repeatPassword: '',
        code: '',
      },
      successCountDown: 3,
    });
    const { repeatError, handleBlur, handleFocus } = useCheckRepeat(formVm, toRef(state.form, 'account'));
    const repeatPwRule = useRepeatPwRule(toRef(state.form, 'repeatPassword'));
    const computedState = computed(() => {
      return props.type === 'bind' ? {
        title: '为了您的账号安全，请绑定手机/邮箱',
        btnTitle: '确认绑定',
        codeType: 'REGISTER',
        repeatPasswordTitle: '确认密码',
      } : {
        title: '重置密码',
        btnTitle: '重置密码',
        codeType: 'UPDATE_PASS',
        repeatPasswordTitle: '确认新密码',
      };
    });
    const hasAgree = ref(false);


    const { disabled } = useCode(toRef(state.form, 'account'));

    const toRegister = () => {
      mainComponent.value = {
        name: 'role',
        props: {},
      };
    };
    const toLogin = () => {
      mainComponent.value = {
        name: 'login',
        props: {},
      };
    };


    const resetPassword = async () => {
      await validateForm(formVm.value!);

      try {
        loading.value = true;
        // await codeVm.value?.checkCode();
        if (props.type === 'bind') {
          if (!hasAgree.value) {
            ElMessage.error('请先勾选同意条款');
            return;
          }
          // 绑定邮箱/手机
          if (!accountType.value) {
            throw new Error('角色为空');
          }
          const token = (await api.registerAndLogin({
            account: state.form.account,
            pw: state.form.password,
            code: state.form.code,
            type: accountType.value,
            channel: '1',
            scene: qrcodeScene.value,
          })).data;
          mainComponent.value = {
            name: 'success',
            props: {
              title: '绑定成功',
              token,
            },
          };
          // await  handleLogined(token);
        } else {
          // 重置密码
          await api.resetPassword({
            account: state.form.account,
            pw: state.form.password,
            code: state.form.code,
          });
          mainComponent.value = {
            name: 'success',
            props: {
              title: '重置密码成功',
              isReturnLogin: true,
            },
          };
        }
      } finally {
        loading.value = false;
      }
    };


    return {
      ...toRefs(state),
      formVm,
      codeVm,
      resetPassword,
      toRegister,
      toLogin,
      disabled,
      hasAgree,
      computedState,
      repeatPwRule,
      complexPwRule,
      repeatError,
      handleBlur,
      handleFocus,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.reset-password {
  .wx-icon {
    font-size: 30px;
  }

  .footer-link {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
