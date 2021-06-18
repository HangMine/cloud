<template>
  <div class="user" :class="`user-${size}`">
    <slot name="avatar">
      <BaseImage class="avatar" :src="userImage"></BaseImage>
    </slot>
    <div class="content ellipsis" :class="{ ellipsis: !$slots.default }">
      <slot>
        {{ user.account || user.email || user.mail || user.name }}
      </slot>
    </div>
  </div>
</template>
<script>
import BaseImage from '@/components/base/Image';

export default {
  name: 'user',
  components: {
    BaseImage,
  },
  props: {
    user: {},
    size: { default: 'medium' },
  },
  computed: {
    userImage() {
      return this.user.headImg || this.user.avatar || this.user.icon || require('@/assets/img/header/default_avatar.png');
    },
  },

};
</script>
<style lang="scss" scoped>
.user {
  max-width: 100%;
  display: flex;
  align-items: center;
  &-medium {
    .avatar {
      width: 36px;
      height: 36px;
    }
  }
  &-small {
    .avatar {
      width: 28px;
      height: 28px;
    }
  }
  &-mini {
    .avatar {
      width: 24px;
      height: 24px;
    }
  }
  &-large {
    .avatar {
      width: 40px;
      height: 40px;
    }
  }
  .avatar {
    border-radius: 50%;
    background-color: #f5f5f5;
    margin-right: 10px;
  }
  /deep/ .img-err {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
  }
  .content {
    flex: 1;
  }
  .ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
