<template>
  <MutiShare v-if="isMuti" :materials="materials" :qrcodeDataUrl="qrcodeDataUrl"></MutiShare>
  <SingleShare v-else :material="materials[0]" :qrcodeDataUrl="qrcodeDataUrl"></SingleShare>
</template>

<script lang="ts">
import { MaterialDetail, MaterialList } from '@/models/Material';
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, onUnmounted,
} from 'vue';
import SingleShare from './SingleShare.vue';
import MutiShare from './MutiShare.vue';
import { isLoadedEnd } from './utils';


export default defineComponent({
  name: 'share-content',
  components: { SingleShare, MutiShare },
  props: {
    materials: {
      type: Array as PropType<MaterialList>,
      required: true,
    },
    qrcodeDataUrl: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const isMuti = computed(() => props.materials.length > 1);
    onUnmounted(() => {
      isLoadedEnd.value = false;
    });

    return {
      isMuti,
    };
  },
});
</script>
<style lang="scss" >
// @import 'url'
.share-content {
  width: 375px;
  height: 667px;
  display: flex;
  flex-direction: column;
  align-content: stretch;
  justify-content: space-between;
  // height: 542px;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #00bfa8;
  background-position: top, bottom;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .logo {
      color: white;
      width: 115px;
    }
    .subtitle {
      color: white;
      font-size: 12px;
      letter-spacing: 1px;
      line-height: 16px;
      font-weight: 400;
      margin-top: 2px;
      ::before,
      ::after {
        content: "";
        width: 10px;
        height: 1px;
        background: #ffffff;
      }
    }
  }

  .share-main {
    padding: 10px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 2px 6px 0px rgba(12, 80, 69, 0.18);
    .detail {
      position: relative;
      padding-top: 100%;
      border-radius: 5px;
      overflow: hidden;
      .detail-img {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
    }
  }
  .footer {
    color: white;
    .left {
      text-align: center;
      margin-right: 7px;
      h2 {
        font-weight: 600;
        font-size: 17px;
        line-height: 17px;
      }
      p {
        margin-top: 6px;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 5px;
      }
    }
    .right {
      width: 78px;
      height: 78px;
      padding: 4px;
      border-radius: 50%;
      overflow: hidden;
      background: white;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
