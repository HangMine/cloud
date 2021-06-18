<template>
  <div class="apply-content-dialog">
    <div class="content-box">
      {{ applyContent }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  name: '',
  dialogify: {
    props: {
      title: '申请内容',
      width: '430px',
      closeOnClickModal: false,
    },
  },
  components: {},
  props: {
    applyContent: { type: String },
  },
  setup() {
    return {};
  },
});
</script>
<style lang='scss' scoped>
.apply-content-dialog {
  .content-box {
    max-height: 302px;
    overflow-y: scroll;
    line-height: 24px;
  }
}
</style>
