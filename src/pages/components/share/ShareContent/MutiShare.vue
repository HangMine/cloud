<template>
  <div class="share-content scrollable-y" :style="bgStyle">
    <div class="header">
      <img class="logo" :src="require('@/assets/img/share/logo.png')" alt="" />
      <h3 class="subtitle">数字化协同平台</h3>
    </div>
    <div class="share-main">
      <ul class="color-card-list">
        <li v-for="(material, i) of showMaterials" :key="i" class="color-card">
          <div class="color-card-item material-img">
            <base-image :src="getImgUrl(material)" @load="imgLoad(material)" />
          </div>
          <template v-if="materials.length > 6 && i === 5">
            <div class="color-card-item more-materials">
              <h3>+{{ materials.length - 6 }}</h3>
              <p>更多材料...</p>
            </div>
          </template>
        </li>
      </ul>
    </div>
    <div class="footer flex-center">
      <div class="left">
        <h2>扫描二维码</h2>
        <p>浏览更多材料</p>
      </div>
      <div class="right">
        <img class="qrcode" v-show="qrcodeDataUrl" :src="qrcodeDataUrl" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  MaterialDetail, MaterialList, MaterialListItem, RenderingInfoItem,
} from '@/models/Material';
import { url2ImageUrl } from '@/utils/qrcode';
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, watch, onMounted,
} from 'vue';
import { getMaterialImg } from '../../material/utils';
import { isLoadedEnd } from './utils';

export default defineComponent({
  name: 'muti-share-content',
  components: {},
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
    const state = reactive({
      imgLoadedEnd: {} as Obj,
      // qrcodeDataUrl: '',
    });
    const showMaterials = computed(() => props.materials.slice(0, 6));
    const allImgLoaded = computed(() => {
      const allValue = Object.values(state.imgLoadedEnd);
      const allMaterialImgLoaded = allValue.length > 0 && allValue.every(item => item);
      // const qrcodeImgLoaded = !!state.qrcodeDataUrl;
      return allMaterialImgLoaded;
    });
    watch(allImgLoaded, (value) => {
      isLoadedEnd.value = value;
    });
    const getImgUrl = (material: MaterialListItem) => {
      return getMaterialImg(material);
    };
    const bgStyle = {
      backgroundImage: `url(${require('@/assets/img/share/bg-top.png')}),url(${require('@/assets/img/share/bg-bottom.png')})`,
    };
    const getColorStyle = (material: MaterialListItem) => {
      return {
        backgroundImage: `url(${getImgUrl(material)})`,
      };
    };
    const imgLoad = (material: MaterialListItem) => {
      state.imgLoadedEnd[material.id] = true;
    };

    onMounted(async () => {
      // TODO: 多材料分享的ID值需与产品确定后修改,比如是否定位到小程序的材料列表页面
      // state.qrcodeDataUrl = await url2ImageUrl('ideation://material_detail?id=MutiMaterialShare', {
      //   level: 'Q',
      //   padding: 0,
      // });
    });
    return {
      ...toRefs(state), showMaterials, bgStyle, getColorStyle, getImgUrl, imgLoad, allImgLoaded,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.share-content {
  .header {
    padding-top: 13px;
  }
  .footer {
    padding-bottom: 7px;
  }
  .share-main {
    margin: 0 15px;
    .detail {
      position: relative;
      padding-top: 100%;
      border-radius: 5px;
      overflow: hidden;
    }
    .color-card-list {
      // padding-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      .color-card {
        position: relative;
        width: 44.5%;
        padding-top: 44.5%;
        background-size: contain;
        border-radius: 5px;
        overflow: hidden;
        margin: 8px;
        .color-card-item {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
        }
        .material-img {
        }
        .more-materials {
          color: white;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          h3 {
            font-size: 25px;
          }
        }
      }
    }
  }
}
</style>
