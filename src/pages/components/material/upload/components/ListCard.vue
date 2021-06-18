<template>
  <div class="upload-list-card" :class="{ empty: isEmpty }">
    <IconTip
      :content="des"
      placement="bottom-end"
      popper-class="list-card-tooltip"
      :iconStyle="{ color: '#ccc' }"
    ></IconTip>
    <div v-show="isEmpty" class="empty-content" @click="clickEmpty">
      <i class="empty-icon" :class="icon"></i>
      <p class="empty-title flex-space-between">{{ title }}</p>
    </div>
    <div v-show="!isEmpty" class="content">
      <p class="title flex-space-between">{{ title }}</p>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType,
} from 'vue';
import IconTip from '@/components/tip/IconTip.vue';

export default defineComponent({
  name: 'upload-list-card',
  components: { IconTip },
  props: {
    type: {
      type: String as PropType<'img' | 'video' | 'file'>,
      required: true,
    },
    isEmpty: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['click-empty'],
  setup(props, { emit }) {
    const _state = (() => {
      switch (props.type) {
        case 'img':
        default:
          return {
            title: '上传图片',
            icon: 'i-r-tupian-14',
            des: '支持jpg/png/jpeg格式，单张图片不超过2M，总数量不超过6张',
          };
        case 'video':
          return {
            title: '上传视频',
            icon: 'i-r-shipin-14',
            des: '支持mp4格式，单个视频不超过25M，总数量不超过3个',
          };
        case 'file':
          return {
            title: '上传文件',
            icon: 'i-r-wendang-14',
            des: '支持pdf/doc/docx/xls/xlsx/ppt/pptx格式，文件总大小不超过1G',
          };
      }
    })();
    const clickEmpty = () => {
      emit('click-empty');
    };
    const state = reactive({ ..._state });
    return {
      ...toRefs(state), clickEmpty,
    };
  },
});
</script>
<style lang="scss">
.list-card-tooltip {
  width: 200px;
}
</style>
<style lang="scss" scoped>
// @import 'url'
.upload-list-card {
  position: relative;
  background: #fcfcfc;
  border: 1px solid #dddddd;
  border-radius: 5px;
  padding: 20px;

  transition: border 0.2s;
  /deep/ .upload-list li.img-item {
    overflow: initial;
    margin-bottom: 30px;
  }
  &.empty {
    cursor: pointer;
    &:hover {
      border-color: $color-primary;
    }
    .empty-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 170px;

      .empty-icon {
        font-size: 28px;
        margin-bottom: 15px;
      }
    }
  }
  .title {
    margin-bottom: 16px;
  }
  /deep/.icon-tip {
    position: absolute;
    right: 8px;
    top: 8px;
  }
}
</style>
