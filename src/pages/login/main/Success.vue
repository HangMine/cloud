<template>
  <main class="comp-main">
    <div class="success-comp">
      <img class="success-icon" :src="require('@/assets/img/public/success.png')" />
      <h3 class="tip">{{ title }}</h3>
      <el-button class="login-btn" type="primary" @click="handleBack">{{ successCountDown }}s返回</el-button>
    </div>
  </main>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, onMounted,
} from 'vue';
import { handleLogined, mainComponent } from '../utils/loginStore';

export default defineComponent({
  name: 'success-comp',
  components: {},
  props: {
    isReturnLogin: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      successCountDown: 3,
      timer: null as NodeJS.Timeout | null,
    });
    const toLogin = () => {
      mainComponent.value = {
        name: 'login',
        props: {},
      };
    };

    const handleBack = async () => {
      state.timer && clearInterval(state.timer);
      if (props.isReturnLogin || !props.token) {
        toLogin();
        return;
      }
      await handleLogined(props.token);
    };

    onMounted(() => {
      state.timer = setInterval(async () => {
        if (state.successCountDown !== 1) {
          state.successCountDown--;
        } else {
          await handleBack();
          state.successCountDown = 3;
          toLogin();
        }
      }, 1000);
    });
    return {
      ...toRefs(state), handleBack,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.success-comp {
  text-align: center;
  img {
    width: 60px;
    height: 60px;
    margin: 80px 0 20px 0;
  }
  .tip {
    color: #222222;
    margin-bottom: 96px;
  }
  .login-btn {
    margin-bottom: 80px;
  }
}
</style>
