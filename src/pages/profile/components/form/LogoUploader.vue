<template>
  <el-form-item prop="logo">
    <template #label>
      <label class="el-form-item__label">Logo</label>
      <IconTip
        placement="bottom"
        popper-class="upload-logo-tooltip"
        content="图片比例：200px x 120px, 少于 100kb"
      ></IconTip>
    </template>
    <Upload
      :url="logoUrl"
      @update:url="clearLogoUrl"
      v-model="logoFile"
      class="upload-logo"
      width="114px"
      :options="{ types: ['png', 'jpg', 'jpeg'] }"
      :validOptions="[{ extensions: ['png', 'jpg', 'jpeg'], sizeLimit: 100 * 1024 }]"
      showHoverVeil
    >
    </Upload>
  </el-form-item>
</template>
<script lang="ts">
import IconTip from '@/components/tip/IconTip.vue';
import Upload from '@/components/form/upload/index.vue';
import uploadToOSS from '@/utils/oss/uploadToOSS';

import {
  defineComponent, reactive, watch, toRefs, PropType, ref,
} from 'vue';

export default defineComponent({
  name: 'logo-uploader',
  components: {
    IconTip,
    Upload,
  },
  props: {
    logoUrl: {
      type: String,
      default: '',
    },
  },
  emits: ['upload'],
  setup(props, { emit }) {
    const logoFile = ref<File | null>(null);
    watch(logoFile, async (file) => {
      if (!file) {
        return;
      }
      // 上传到OSS
      const logoPath = await uploadToOSS(file as File, 'BRAND_IMG');
      emit('upload', logoPath);
    });
    const clearLogoUrl = (url: string) => {
      if (url === '') {
        emit('upload', '');
      }
    };
    return {
      logoFile,
      clearLogoUrl,
    };
  },
});
</script>

<style lang="scss" scoped>
/deep/ .icon-tip {
  font-size: $font-size-mini !important;
  margin-left: 4px;
  color: #ccc !important;
}
/deep/ .upload-logo {
  .upload-content {
  }
}
</style>
<style lang="scss">
.upload-logo-tooltip {
  color: #666;
  padding: 4px 12px;
  border: none !important;
  background-color: red;
  box-shadow: 0 2px 6px 0 rgba(28, 35, 63, 0.2);
}
</style>
