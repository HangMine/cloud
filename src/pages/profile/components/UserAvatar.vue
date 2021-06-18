<template>
  <div class="avatar-box flex-column flex-vertical-center">
    <div class="avatar">
      <BaseImage class="avatar-img" :src="imageUrl" />
      <div class="avatar-veil flex-center" @click="showEditAvatarDialog">修改头像</div>
    </div>
    <!-- TODO: 让后端把type放到用户数据中 -->
    <el-tag effect="dark" class="append-tag">{{ idenityType === 12 ? "买家" : "卖家" }}</el-tag>
  </div>
</template>

<script lang="ts">
import { defineComponent, Prop, PropType } from 'vue';
import BaseImage from '@/components/base/Image.vue';
import { dialog } from '@/utils/vue/dialog';
import ChangeAvatarDialogForm from './dialog/ChangeAvatarDialogForm.vue';

export default defineComponent({
  props: {
    imageUrl: {
      type: String,
      default: '@/assets/img/header/default_avatar.png',
    },
    // 用户类型: 卖家/买家
    idenityType: {
      type: Number,
    },
  },
  components: {
    BaseImage,
  },
  setup() {
    // const state = {};
    const showEditAvatarDialog = async () => {
      await dialog({
        is: ChangeAvatarDialogForm,
      });
    };
    return {
      showEditAvatarDialog,
    };
  },
});
</script>

<style lang="scss" scoped>
$appendTagHeight: 22px;
.avatar-box {
  position: relative;
  margin-bottom: 6px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;

  &:hover .avatar-veil {
    display: flex;
  }
}

.avatar-veil {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  font-size: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: pointer;
  transition: all linear 300ms;
}
.append-tag {
  position: relative;
  // font-size: $font-size-mini;
  border-radius: $appendTagHeight/2;
  height: $appendTagHeight;
  line-height: $appendTagHeight;
  margin-top: -$appendTagHeight/2;
}
</style>
