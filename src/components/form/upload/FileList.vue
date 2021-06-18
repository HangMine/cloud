<template>
  <UploadList
    v-model="fileList"
    class="file-list"
    :options="{ types: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'] }"
    :validOptions="['pdf', 'word', 'sheet', 'ppt']"
    v-bind="$attrs"
    ref="uploadListVm"
  >
    <template #default="{ item }">
      <div class="default-upload-file">
        <img :src="type2Img(item.name)" />
      </div>
    </template>
    <template #append="{ i, item }">
      <slot name="append" :i="i" :item="item"></slot>
    </template>
  </UploadList>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import getExt from '_/get-ext';
import BaseImage from '@/components/base/Image.vue';
import UploadList from './UploadList.vue';

export default defineComponent({
  name: 'file-list',
  inheritAttrs: false,
  components: { UploadList },
  props: {},
  setup(props, { emit }) {
    const uploadListVm = ref<InstanceType<typeof UploadList>>();
    const state = reactive({
      fileList: [] as File[],
    });
    const type2Img = (file: File) => {
      switch (getExt(file)) {
        case 'pdf':
          return require('@/assets/img/file/pdf.png');
        case 'doc':
        case 'docx':
          return require('@/assets/img/file/word.png');
        case 'xls':
        case 'xlsx':
          return require('@/assets/img/file/xlsx.png');
        case 'ppt':
        case 'pptx':
          return require('@/assets/img/file/pptx.png');
        default:
          return require('@/assets/img/file/ohter.png');
      }
    };
    return {
      ...toRefs(state), uploadListVm, type2Img,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
</style>
