<template>
  <div class="video-wrap">
    <video :src="src" class="base-video" :preload="preload" ref="videoEl"></video>
    <span class="play-icon hover-link flex-center" @click="start">
      <i class="icon i-s-bofanganniu-18"></i>
    </span>
  </div>
</template>

<script lang="ts">
import { dialog } from '@/utils/vue/dialog';
import {
  defineComponent, reactive, computed, ref, toRefs, onMounted, PropType, h, getCurrentInstance,
} from 'vue';
import Controller from './Controller.vue';

export default defineComponent({
  name: 'base-video',
  components: {},
  props: {
    src: {
      type: String,
      required: true,
    },
    preload: {
      type: String as PropType<HTMLVideoElement['preload']>,
      default: 'metadata',
    },
  },
  setup(props, { emit }) {
    const videoEl = ref<HTMLVideoElement>();
    const state = reactive({});
    const start = async () => {
      await dialog({
        is: Controller,
        props: {
          src: props.src,
        },
      });
    };
    return {
      ...toRefs(state), videoEl, start,
    };
  },

});
</script>
<style lang="scss" scoped>
// @import 'url'
.video-wrap {
  position: relative;
  height: 100%;
  background: black;
  .base-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .close-icon {
    position: absolute;
    right: 5px;
    top: 5px;
  }
  .play-icon {
    position: absolute;
    width: 44px;
    height: 44px;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    cursor: pointer;
    transition: color 0.2s;
    i {
      font-size: 18px;
      color: #fff;
    }
    &:hover {
      i {
        color: $color-primary;
      }
    }
    // &::after {
    //   content: "";
    //   position: absolute;
    //   left: 13px;
    //   top: 6px;
    //   width: 0;
    //   height: 0;
    //   border: 10px solid transparent;
    //   border-left-color: #fff;
    //   border-radius: 4px;
    // }
  }
}
</style>
