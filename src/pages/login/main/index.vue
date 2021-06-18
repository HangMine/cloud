<template>
  <main class="login-main">
    <section class="content-left">
      <img src="@/assets/img/login/logo-register.png" class="logo" @click="$router.push({ name: 'Login' })" />
      <img class="login-holder" src="@/assets/img/login/login-holder.png" />
    </section>
    <section class="content-right">
      <div class="login">
        <el-form :model="form" @submit.prevent ref="formVm">
          <el-tabs v-model="currentTab" class="login-tab">
            <el-tab-pane label="账号密码登录" name="account"> </el-tab-pane>
            <el-tab-pane label="验证码登录" name="code"> </el-tab-pane>
          </el-tabs>
          <transition name="el-zoom-in-top">
            <div v-if="loginError" class="error-msg">
              {{ loginError }}
            </div>
          </transition>
          <Account v-model="form.account"></Account>
          <Password v-if="currentTab === 'account'" v-model="form.password" @keydown.enter="login"></Password>
          <IdentCode
            v-else-if="currentTab === 'code'"
            v-model="form.code"
            :disabled="disabled"
            type="LOGIN"
            :account="form.account"
            ref="codeVm"
          ></IdentCode>
        </el-form>
        <el-button class="login-btn" type="primary" @click="login">登录</el-button>
        <div class="flex-space-between" :style="{ marginBottom: '100px' }">
          <span :style="{ cursor: 'pointer' }" @click="forgetPassword">忘记密码</span>
          <span class="text-link" @click="register">注册账号</span>
        </div>
        <ThirdLogin></ThirdLogin>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, toRef, watch, onMounted, onUnmounted,
} from 'vue';
import validateForm from '@/utils/validators/validate-form';
import { ElForm } from 'element-plus';
import * as api from '@/api/account';
import AppError from '@/utils/error';
import i18n from '@/i18n';
import useCode from '../utils/useCode';
import {
  handleLogined, loading, mainComponent, qrcodeScene,
} from '../utils/loginStore';
import Account, { checker as accountChecker } from '../components/inputs/Account.vue';
import Password, { checker as pwChecker } from '../components/inputs/Password.vue';
import IdentCode, { checker as codeChecker } from '../components/inputs/IdentCode.vue';
import ThirdLogin from '../components/ThirdLogin.vue';

export default defineComponent({
  name: 'login',
  components: {
    IdentCode, Account, Password, ThirdLogin,
  },
  props: {
    qrcodeScene: {
      type: String,
    },
  },

  setup(props, { emit }) {
    const formVm = ref<typeof ElForm>();
    const codeVm = ref<InstanceType<typeof IdentCode>>();
    const state = reactive({
      currentTab: 'code' as 'account' | 'code',
      form: {
        account: '',
        password: '',
        code: '',
      },
      loginError: '' as string,
    });
    const { disabled } = useCode(toRef(state.form, 'account'));

    // 表单自动填充导致一开始无法更新state.form的值,暂时不用
    // const btnDisabled = computed(() => {
    //   let isPass = false;
    //   switch (state.currentTab) {
    //     case 'account':
    //       isPass = accountChecker(state.form.account) && pwChecker(state.form.password);
    //       break;
    //     case 'code':
    //       isPass = accountChecker(state.form.account) && codeChecker(state.form.code);
    //       break;

    //     default:
    //       break;
    //   }
    //   return !isPass;
    // });
    watch(() => state.currentTab, () => {
      formVm.value?.clearValidate();
      state.loginError = '';
    });
    const loginErrorHandle = (err: AppError) => {
      switch (err.code) {
        case 131001:
          // 密码错误，需要提示剩余次数，涉及到翻译，所以后端只在err.message中返回剩余次数（数字），前端根据code翻译
          err.message = `密码错误五次后将锁止密码登录，剩余${err.message}次`;
          break;
        case 131034:
          // 密码已过期
          err.message = i18n.t('login.reset_tip');
          break;

        default:
          err.message = i18n.t(`public.code_msg._${err.code}`, err.message || i18n.t('login.system_error')); // AppError.MESSAGES[err.code];
          break;
      }
      state.loginError = err.message;
    };

    const login = async () => {
      await validateForm(formVm.value!);
      try {
        loading.value = true;
        let t = '';
        if (state.currentTab === 'code') {
          // await codeVm.value?.checkCode();
          t = (await api.codeLogin({
            account: state.form.account,
            code: state.form.code,
            scene: props.qrcodeScene,
          })).data;
        } else {
          t = (await api.accountLogin({
            account: state.form.account,
            pw: state.form.password,
            scene: props.qrcodeScene,
          })).data;
        }
        await handleLogined(t);
      } catch (error) {
        loginErrorHandle(error);
      } finally {
        loading.value = false;
      }
    };
    const forgetPassword = () => {
      mainComponent.value = {
        name: 'reset-password',
        props: { type: 'reset' },
      };
    };
    const register = () => {
      mainComponent.value = {
        name: 'role',
        props: {},
      };
    };

    onMounted(() => {
      state.currentTab = 'account';
    });


    return {
      ...toRefs(state), login, forgetPassword, register, formVm, codeVm, disabled,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.login-main {
  display: flex;
  position: relative;
  width: 800px;
  height: 560px;
  border-radius: 10px;
  overflow: hidden;
  background: white;
  .content-left {
    flex-grow: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 340px;
    height: 100%;
    background: #f3f4f9;

    .logo {
      position: absolute;
      top: 0;
      left: 0;
      margin: 18px 6px;
      height: 20px;
      cursor: pointer;
    }

    .login-holder {
      width: 292px;
    }
  }
  .content-right {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .login {
      width: 320px;
      .login-tab {
        margin-bottom: 15px;
        /deep/.el-tabs__nav-wrap {
          &::after {
            display: none;
          }
        }
        /deep/ .el-tabs__active-bar {
          height: 3px;
        }
        /deep/.el-tabs__item {
          font-weight: 400;
        }
        /deep/.el-tabs__item.is-active {
          color: #333333;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
