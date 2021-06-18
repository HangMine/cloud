<template>
  <el-form-item prop="code" :rules="rule" :label="label">
    <div class="flex">
      <el-input v-model="identCode" class="ident-code-input" placeholder="验证码" autocomplete="off"></el-input>
      <p class="ident-code-btn" :class="{ disabled: computedDisabled }">
        <span @click="getCode">
          {{ countDown > 0 ? `重新获取${countDown}s` : "获取验证码" }}
        </span>
      </p>
    </div>
  </el-form-item>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, PropType,
} from 'vue';
// import useClosest from '@/utils/uses/use-closest';
import delay from '_/delay';
import isFilled from '@/utils/validators/valid-filled';
import validator2ElemRule from '@/utils/validators/utils/validator-to-elem-rule';
import validator2Checker from '@/utils/validators/utils/validator-to-checker';

import openTencentCaptcha, { CaptchaRes } from '@/utils/open-tencent-captcha';
import { CodeType, fetchCode, checkCode as _checkCode } from '@/api/account';

export const rule = validator2ElemRule(isFilled, { trigger: 'blur' });
export const checker = validator2Checker(isFilled);


export default defineComponent({
  name: 'ident-code',
  components: {},
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    captcha: {
      type: Object as PropType<CaptchaRes>,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<CodeType>,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'update:captcha'],
  setup(props, { emit }) {
    const state = reactive({
      identCode: '',
      scene: '',
      countDown: 0,
      captcha: {} as CaptchaRes,
    });
    const computedDisabled = computed(() => {
      return props.disabled || state.countDown > 0;
    });
    watch(() => props.modelValue, (value) => {
      state.identCode = value;
    }, { immediate: true });
    watch(() => state.identCode, (value) => {
      emit('update:modelValue', value);
    });
    watch(() => props.captcha, (value) => {
      state.captcha = value;
    }, { immediate: true });
    watch(() => state.captcha, (value) => {
      emit('update:captcha', value);
    });
    const disableCode = async () => {
      state.countDown = 59;

      const loop = async () => {
        if (state.countDown > 0) {
          await delay(1000);
          state.countDown -= 1;
          await loop();
        }
      };
      await loop();
    };

    const getCode = async () => {
      const captcha = await openTencentCaptcha();
      state.captcha = captcha;
      await fetchCode({
        account: props.account,
        ticket: captcha.ticket,
        randstr: captcha.randstr,
        type: props.type,
      });
      await disableCode();
    };

    const checkCode = () => {
      return _checkCode({
        account: props.account,
        code: state.identCode,
        ticket: state.captcha?.ticket ?? '',
        randstr: state.captcha?.randstr ?? '',
        type: props.type,
      });
    };

    return {
      ...toRefs(state), getCode, computedDisabled, checkCode, rule,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.ident-code-input {
  /deep/.el-input__inner {
    padding-right: 95px;
  }
}
.ident-code-btn {
  position: absolute;
  right: 12px;
  cursor: pointer;
  color: $color-primary;
  &.disabled {
    color: #999999;
    cursor: not-allowed;
    span {
      pointer-events: none;
    }
  }
}
</style>
