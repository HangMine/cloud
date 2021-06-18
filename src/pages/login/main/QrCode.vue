
<template>
  <main class="comp-main" :class="{ 'is-login': !isRegister }">
    <div class="qr-code">
      <h3 class="login-title">微信{{ typeName }}</h3>
      <div class="img-wrap">
        <base-image :src="qrcodeParams.url" />
      </div>
      <p class="footer">扫描关注“4D SHOETECH”公众号进行{{ typeName }}</p>
      <i class="close-icon hover-link el-icon-close" @click="handleClose"></i>
    </div>
  </main>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {
  defineComponent, reactive, computed, ref, toRefs, onMounted, onUnmounted,
} from 'vue';
import BaseImage from '@/components/base/Image.vue';
import useLoopFetch from '@/utils/uses/use-loop-fetch';
import { fetchQrcode, fetchQrcodeResult, QRcodeStatus } from '@/api/account';
import { url2ImageUrl } from '@/utils/qrcode';
import { DefaultResponse } from '@/utils/axios';
import {
  handleLogined, mainComponent, qrcodeScene, accountType,
} from '../utils/loginStore';

export default defineComponent({
  name: 'qr-code',
  components: { BaseImage },
  props: {
    isRegister: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change-main-component'],
  setup(props, { emit }) {
    const state = reactive({
      qrcodeParams: {
        scene: '',
        url: '',
      },
    });
    const typeName = computed(() => (props.isRegister ? '注册' : '登录'));
    const fetchFn = async () => {
      const res = await fetchQrcodeResult({ scene: state.qrcodeParams.scene });
      return res;
    };
    const stopFn = (res: DefaultResponse<{ status: QRcodeStatus, token: string }>) => {
      return res.data?.status !== '1';
    };
    const { loopFetch, stopFetch } = useLoopFetch({
      fetchFn, stopFn, limit: Infinity,
    });

    const createQRcode = async () => {
      const qrcodeParams = (await fetchQrcode()).data;
      qrcodeParams.url = await url2ImageUrl(qrcodeParams.url, { size: 275 });
      state.qrcodeParams = qrcodeParams;
      let { res } = await loopFetch();
      if (res.data?.status === '5') {
        // 如果失效,重新生成二维码
        res = await createQRcode();
      }
      return res;
    };

    const handleClose = () => {
      mainComponent.value = {
        name: props.isRegister ? 'register' : 'login',
        props: {},
      };
    };


    onMounted(async () => {
      const { data } = await createQRcode();
      qrcodeScene.value = state.qrcodeParams.scene;
      const { status, token } = data;
      switch (status) {
        case '3':
          mainComponent.value = accountType.value ? {
            name: 'reset-password',
            props: {},
          } : {
            name: 'role',
            props: {
              resetPasswordType: 'bind',
              qrcodeScene: qrcodeScene.value,
            },
          };
          break;
        case '4':
          await handleLogined(token);
          break;
        default:
          break;
      }
    });

    onUnmounted(() => {
      stopFetch();
    });

    return {
      ...toRefs(state), typeName, handleClose,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.comp-main {
  &.is-login {
    width: 800px;
    height: 560px;
  }
  .qr-code {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .login-title {
      font-size: 20px;
      color: #222222;
    }
    .img-wrap {
      position: relative;
      max-width: 300px;
      margin: 20px 0 40px 0;
      border: 1px solid #cccccc;
      width: 278px;
      height: 278px;
      /deep/ .el-image {
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .footer {
      font-size: 12px;
      color: #999999;
    }
    .close-icon {
      position: absolute;
      right: 24px;
      top: 24px;
      font-size: 20px;
    }
  }
}
</style>
