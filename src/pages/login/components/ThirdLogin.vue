<template>
  <div class="third-login flex-center flex-column">
    <p>{{ computedState.name }}</p>
    <i class="wx-icon i-weixin-42" :style="{ fontSize: '42px', marginTop: '16px' }" @click="openQRcode"></i>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import { mainComponent } from '../utils/loginStore';

export default defineComponent({
  name: 'third-login',
  components: {},
  props: {
    isRegister: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const state = reactive({});
    const computedState = computed(() => ({
      name: props.isRegister ? '第三方账号注册' : '第三方账号登录',
    }));
    const openQRcode = () => {
      mainComponent.value = {
        name: 'qr-code',
        props: {
          isRegister: props.isRegister,
        },
      };
    };
    return {
      ...toRefs(state), computedState, openQRcode,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.third-login {
  .wx-icon {
    font-size: 30px;
    cursor: pointer;
    transition: color 0.2s;
    color: #4dc569;
    // &:hover {
    //   color: #4dc569;
    // }
  }
}
</style>
