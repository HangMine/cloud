<template>
  <el-form-item :prop="prop" :rules="computedRules" :label="label">
    <el-input
      v-model="password"
      class="password"
      type="password"
      placeholder="密码"
      show-password
      v-bind="$attrs"
    ></el-input>
  </el-form-item>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, toRef, PropType,
} from 'vue';
import isFilled from '@/utils/validators/valid-filled';
import validPassword from '@/utils/validators/valid-password';
import validator2ElemRule from '@/utils/validators/utils/validator-to-elem-rule';
import validator2Checker from '@/utils/validators/utils/validator-to-checker';

export const pwRule = validator2ElemRule(isFilled);
export const complexPwRule = validator2ElemRule([isFilled, validPassword], { trigger: 'blur' });
export const checker = validator2Checker([isFilled, validPassword]);

export default defineComponent({
  name: 'password',
  inheritAttrs: false,
  components: {},
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
    },
    label: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
      default: 'password',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const password = ref('');
    const computedRules = computed(() => {
      return props.rules ?? pwRule;
    });

    watch(() => props.modelValue, (value) => {
      password.value = value;
    }, { immediate: true });
    watch(() => password.value, (value) => {
      emit('update:modelValue', value);
    });
    return {
      password, computedRules,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.password {
}
</style>
