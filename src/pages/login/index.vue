<template>
  <div class="login-view flex-column flex-1" :style="viewStyle">
    <div class="login-loading-wrap" v-loading="loading">
      <component :is="mainComponent.name" v-bind="mainComponent.props"></component>
    </div>
  </div>
</template>

<script lang="ts">
import { getContextUser } from '@/loaders/context';
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';

import { loading, mainComponent } from './utils/loginStore';
import Login from './main/index.vue';
import QrCode from './main/QrCode.vue';
import Register from './main/Register.vue';
import ResetPassword from './main/ResetPassword.vue';
import Role from './main/Role.vue';
import Success from './main/Success.vue';

export default defineComponent({
  name: 'login-view',
  components: {
    Login,
    QrCode,
    Register,
    ResetPassword,
    Role,
    Success,
  },
  props: {},
  setup(props, { emit }) {
    const user = computed(() => getContextUser());

    const viewStyle = {
      backgroundImage: `url(${require('@/assets/img/login/login-bg.png')}), linear-gradient(-45deg, #1a7bdb, #7fd9f9)`,
    };

    return {
      mainComponent, loading, viewStyle,
    };
  },
});
</script>
<style lang="scss">
.comp-main {
  display: flex;
  flex-direction: column;
  // align-items: center;
  justify-content: center;
  position: relative;
  width: 400px;
  padding: 40px;
  border-radius: 10px;
  overflow: hidden;
  background: white;
  > div {
    width: 100%;
  }
}
.login,
.comp-main {
  color: #666666;
}
.login-title {
  margin-bottom: 20px;
}
.login-btn {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  border-radius: 20px;
}
.login-logo {
  margin: 0 0 30px -16px;
  height: 24px;
}
.error-msg {
  min-height: 1px;
  margin-bottom: 10px;
  font-size: 12px;
  line-height: 1.5;
  color: #f62020;
}
</style>
<style lang="scss" scoped>
// @import 'url'
.login-view {
  position: relative;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-loading-wrap {
  }
}
</style>
