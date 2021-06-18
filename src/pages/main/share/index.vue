<template>
  <div class="supplier-share flex-column flex-1">
    <header class="introduction-box">
      <div v-show="introduction">
        <UserInfo :isDescriptionVisible="false" />
        <TextCollapse :content="introduction" :showHeight="44"></TextCollapse>
      </div>
    </header>
    <Main :canShareAgain="canShareAgain" :shareId="shareId" :shareInfo="shareInfo"></Main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, ref, toRefs,
} from 'vue';
import TextCollapse from '@/components/upDown/index.vue';
import { useRoute, useRouter } from 'vue-router';
import * as api from '@/api/share';
import { ElMessageBox } from 'element-plus';
import onCreated from '@/utils/vue/onCreated';
import UserInfo from '../../components/Header/components/UserInfo';
import Main from './main/index.vue';

export default defineComponent({
  name: 'supplier-share',

  components: {
    UserInfo,
    Main,
    TextCollapse,
  },
  setup() {
    const { query: { shareId, valid } } = useRoute();
    const router = useRouter();
    if (!shareId) {
      ElMessageBox.alert('当前分享链接无效!', '错误', {
        confirmButtonText: '退出',
        callback: () => {
          router.replace({ name: 'Login' });
        },
      });
      return false;
    }
    const state = reactive({
      canShareAgain: false,
      introduction: '',
      shareInfo: {} as AsyncReturnType<typeof api.fetchShareConfig>['data'],
    });

    const getShareInfo = async () => {
      const shareInfo = await api.fetchShareConfig(shareId as string);
      const shareType = shareInfo.data.type; // 分享权限: 1-公开|2-加密
      if (shareType === 2 && !valid) {
        router.replace({ path: 'share-validation', query: { shareId } });
      }
      state.canShareAgain = !!shareInfo.data.isAgain;
      state.introduction = shareInfo.data.subject;
      state.shareInfo = shareInfo.data;
    };
    onCreated(() => getShareInfo());

    return {
      shareId,
      ...toRefs(state),
    };
  },
});
</script>


<style lang="scss" scoped>
.supplier-share {
  height: 0;
  .introduction-box {
    box-shadow: 0px 2px 4px 0px rgba(128, 128, 128, 0.1);
    padding-bottom: 46px;
    background-color: #fff;
    margin-bottom: -46px;
    > div {
      margin: 20px;
    }
  }
  .user-info {
    margin-bottom: 12px;
  }
  .up-down {
    padding-left: 44px;
  }
}
</style>
