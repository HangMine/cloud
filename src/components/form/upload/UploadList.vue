<template>
  <ul class="upload-list" :class="{ 'show-title': showTitle }">
    <li v-for="(uploadItem, i) of uploadItems" :key="uploadItem.url" class="img-item" :style="itemStyle">
      <slot :i="i" :item="uploadItem">
        <el-image class="img-wrap" :src="uploadItem.url" fit="contain"></el-image>
      </slot>
      <slot name="append" :i="i" :item="uploadItem" :url="uploadItem.url">
        <over-text v-if="showTitle" class="img-item-title">{{ uploadItem.name }}</over-text>
      </slot>
      <i class="default-upload-close-icon el-icon-close" @click.stop="close(i)"></i>
    </li>
    <li v-show="!disabled" class="upload-item" :style="itemStyle">
      <slot name="upload">
        <Upload
          :options="{ types: ['png', 'jpg', 'jpeg'] }"
          :validOptions="['img']"
          @update:files="fileChange"
          :multiple="true"
          v-bind="$attrs"
          ref="uploadVm"
        >
          <template #default="{ upload, url, close }">
            <slot name="uploadSlot" :upload="upload" :url="url" :close="close">
              <div class="default-upload-list-add flex-center" @click="upload">
                <i class="i-l-tianjia-34"></i>
              </div>
            </slot>
          </template>
        </Upload>
      </slot>
    </li>
  </ul>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, watch,
} from 'vue';
import { getPx } from '@/utils/util';
import { ElImage } from 'element-plus';
import { EnclosureItem } from '@/models/Material';
import Upload from './index.vue';
import { UploadItems } from './utils';


export default defineComponent({
  name: 'upload-list',
  inheritAttrs: false,
  components: { Upload, ElImage },
  props: {
    modelValue: {
      type: Object as PropType<UploadItems>,
    },
    width: {
      type: [Number, String],
      default: 102,
    },
    maxLength: {
      type: Number,
      default: Infinity,
    },
    validate: {
      type: Function as PropType<(addFiles: File[], existedItems: UploadItems) => boolean>,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const uploadVm = ref<InstanceType<typeof Upload>>();
    const state = reactive({
      uploadItems: [] as UploadItems,
    });

    const disabled = computed(() => state.uploadItems.length >= props.maxLength);


    const itemStyle = computed(() => {
      const width = getPx(props.width);
      return {
        width,
        height: width,
      };
    });
    watch(() => props.modelValue, (value) => {
      state.uploadItems = value || [];
    }, { immediate: true });
    watch(() => state.uploadItems, () => {
      emit('update:modelValue', state.uploadItems);
    }, { deep: true });
    const fileChange = async (files: File[]) => {
      // 自定义检验函数
      if (props.validate) {
        await props.validate(files, state.uploadItems);
      }
      state.uploadItems = [...state.uploadItems, ...files.map(file => ({ item: file, url: URL.createObjectURL(file), name: file.name }))];
      // 超过最大上传长度默认切除,并给出提示
      if (state.uploadItems.length > props.maxLength) {
        state.uploadItems = state.uploadItems.slice(0, props.maxLength);
        throw new Error('超过最大上传数');
      }
    };
    const close = (i: number) => {
      state.uploadItems.splice(i, 1);
    };
    return {
      ...toRefs(state), disabled, fileChange, close, itemStyle, uploadVm,
    };
  },
});
</script>
<style lang="scss">
.upload-wrap.is-dragover {
  .default-upload-list-add {
    i {
      color: $color-primary !important;
    }
    border-color: $color-primary !important;
  }
}
</style>
<style lang="scss" scoped>
// @import 'url'
.upload-list {
  &.show-title {
    li {
      &.img-item {
        margin-bottom: 30px; // 显示名字时
        overflow: initial;
        /deep/.el-image__error {
          display: none; // 关闭加载提示的文字
        }
      }
    }
  }
  li {
    display: inline-block;
    vertical-align: top;

    &.img-item {
      display: inline-block;
      position: relative;
      margin: 0 8px 8px 0;
      border: 1px solid #dddddd;
      border-radius: 5px;
      overflow: hidden;
      .default-upload-close-icon {
        opacity: 0;
      }
      &:hover {
        .default-upload-close-icon {
          opacity: 1;
          color: #fff;
        }
      }
    }
    &.upload-item {
      /deep/ .upload-wrap {
        height: 100%;
      }
    }

    .img-wrap {
      width: 100%;
      padding-top: 100%;
      position: relative;
      /deep/.el-image__inner {
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
</style>
