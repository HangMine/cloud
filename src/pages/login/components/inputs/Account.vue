<template>
  <el-form-item :prop="prop" :rules="rule" :label="label">
    <el-input
      v-model="account"
      class="account"
      placeholder="手机号/邮箱"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
      v-bind="$attrs"
      ref="inputVm"
    ></el-input>
    <transition name="el-zoom-in-top">
      <div v-if="error" class="el-form-item__error">
        {{ error }}
      </div>
    </transition>
  </el-form-item>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch,
} from 'vue';

import validator2ElemRule from '@/utils/validators/utils/validator-to-elem-rule';
import validAccount from '@/utils/validators/valid-account';
import validator2Checker from '@/utils/validators/utils/validator-to-checker';

import { ElInput } from 'element-plus';


export const rule = validator2ElemRule(validAccount, { trigger: 'blur' });
export const checker = validator2Checker(validAccount);

export default defineComponent({
  name: 'account',
  inheritAttrs: false,
  components: {},
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    error: {
      type: String,
    },
    label: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
      default: 'account',
    },
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  setup(props, { emit }) {
    const inputVm = ref<InstanceType<typeof ElInput>>();
    const state = reactive({
      account: '',
    });

    watch(() => props.modelValue, (value) => {
      state.account = value;
    }, { immediate: true });
    watch(() => state.account, (value) => {
      emit('update:modelValue', value);
    });
    return {
      ...toRefs(state), rule, inputVm,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.account {
}
</style>
