
<template>
  <div class="video-controller-wrap">
    <div class="video-content">
      <video :src="src" autoplay controls ref="videoEl"></video>
    </div>
    <div class="video-controller"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, onMounted, createVNode, h,
} from 'vue';

export default defineComponent({
  name: 'video-controller',
  dialogify: {
    props: {
      // width: '80vw',
      title: '视频播放',
      fullscreen: true,
      customClass: 'video-controller-dialog',
    },
  },
  components: {},
  props: {
    src: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.video-controller-dialog {
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
}
</style>

<style lang="scss" scoped>
.video-controller-wrap {
  overflow: auto;
  height: 100%;
  .video-content {
    overflow: hidden;
    height: 100%;
    video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>


