<template>
  <div class="agree">
    <el-checkbox v-model="agree"></el-checkbox>
    我已阅读并同意
    <span class="text-link">
      <router-link target="_blank" :to="{ name: 'PolicyTermsConditions' }" class="text-link"> 使用条款 </router-link>
      、
      <router-link target="_blank" :to="{ name: 'PolicyPrivacyPolicy' }" class="text-link">
        隐私政策
      </router-link> </span
    >和
    <router-link target="_blank" :to="{ name: 'PolicyLicenseAgreement' }" class="text-link"> 许可协议 </router-link>
  </div>
</template>

<script lang="ts">
import openWindow from '@/utils/open-window';
import {
  defineComponent, reactive, computed, ref, toRefs, watch,
} from 'vue';

export default defineComponent({
  name: 'agree',
  components: {},
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const state = reactive({
      agree: false,
    });
    watch(() => props.modelValue, (value) => {
      state.agree = value;
    }, { immediate: true });
    watch(() => state.agree, (value) => {
      emit('update:modelValue', value);
    });
    const openWin = (url: string) => {
      openWindow(url);
    };
    return {
      ...toRefs(state), openWin,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.agree {
  margin-bottom: 20px;
  font-size: 12px;
}
</style>
