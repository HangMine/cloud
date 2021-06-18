<template>
  <div class="user-info-brief flex-column flex-vertical-center">
    <UserAvatar :image-url="userImage" :idenityType="userInfo.type"></UserAvatar>
    <p class="brief-account flex-vertical-center">
      <span>{{ userInfo.account }}</span>
      <i class="iconfont i-r-bianji-16" @click="handleChangeAccount" />
    </p>
    <el-tag class="unaudited-account-notice" v-if="userInfo.status !== 4">未审核试用账号</el-tag>
    <el-button type="text" class="brief-password" @click="handleChangePassword">修改登录密码</el-button>
  </div>
</template>

<script lang="ts">
// import BaseImage from '@/components/base/Image.vue';
import { defineComponent, ref, computed } from 'vue';
import { getContextUser } from '@/loaders/context';
import { User } from '@/models/Context';
import { dialog } from '@/utils/vue/dialog';
import UserAvatar from './UserAvatar.vue';
import ChangePasswordDialogForm from './dialog/ChangePasswordDialogForm.vue';
import ChangeAccountDialogForm from './dialog/ChangeAccountDialogForm.vue';

export default defineComponent({
  name: 'user-info-brief',
  components: {
    UserAvatar,
    // FormUserInfo,
    // DialogUploadAvatar,
  },

  setup() {
    const userInfo = computed(() => getContextUser() as User);
    console.log(userInfo);
    // const userInfo = {
    //   headImg: '',
    //   account: '112233',
    // };
    const userImage = computed(() => userInfo.value.headImg || require('@/assets/img/header/default_avatar.png'));
    const handleChangeAccount = async () => {
      await dialog({
        is: ChangeAccountDialogForm,
        props: {
          currentAccount: userInfo.value?.account,
        },
      });
    };
    const handleChangePassword = async () => {
      await dialog({
        is: ChangePasswordDialogForm,
      });
    };
    return {
      userInfo,
      userImage,
      handleChangeAccount,
      handleChangePassword,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-info-brief {
  font-size: $font-size-mini;
  margin-bottom: 20px;
}
$appendTagHeight: 22px;
.avatar-box {
  position: relative;
  margin-bottom: 6px;
}
.el-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.append-tag {
  position: relative;
  // font-size: $font-size-mini;
  border-radius: $appendTagHeight/2;
  height: $appendTagHeight;
  line-height: $appendTagHeight;
  margin-top: -$appendTagHeight/2;
}

.brief-account {
  line-height: 16px;
  margin-bottom: 6px;
  font-size: $font-size-small;
  i {
    margin-left: 6px;
    cursor: pointer;
  }
}
$unauditedNoticeTagHeight: 20px;
.unaudited-account-notice {
  display: block;
  // font-size: $font-size-mini;
  border: none;
  color: #f38328;
  background-color: #ffefe5;
  border-radius: $unauditedNoticeTagHeight/2;
  height: $unauditedNoticeTagHeight;
  line-height: $unauditedNoticeTagHeight;
  margin-bottom: 6px;
}
.el-button {
  font-size: inherit;
  padding: 0;
  line-height: 18px;
  min-height: unset !important;
}
</style>
