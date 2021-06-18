<template>
  <div class="share-content scrollable-y" :style="bgStyle">
    <div class="header">
      <img class="logo" :src="require('@/assets/img/share/logo.png')" />
      <h3 class="subtitle">数字化协同平台</h3>
    </div>
    <div class="share-main">
      <div class="detail">
        <base-image class="detail-img" :src="materialImg" @load="materialImgLoaded = true" />
      </div>
      <div class="detail-main-bottom">
        <ul class="color-card-list">
          <li v-for="(item, i) of showRenderingInfo" :key="i" class="color-card" :style="getColorStyle(item)"></li>
          <li v-if="renderingInfo.length > 10" class="color-card hide-more">
            <div class="flex-center">+{{ renderingInfo.length - 10 }}</div>
          </li>
        </ul>
        <h2 class="title">{{ attributeInfo?.name || "" }}</h2>
        <div class="info flex-space-between">
          <div class="supplier text-one-line">供应商:{{ materialDetail.supplierInfo?.supplierName || "" }}</div>
          <!-- <span class="price-wrap">
            <span class="price">{{ attributeInfo.priceCurrency === "美元" ? "$" : "¥" }}{{ attributeInfo.price }}</span
            ><span class="price-unit">/{{ attributeInfo.priceUnit }}</span>
          </span> -->
        </div>
      </div>
    </div>
    <div class="footer flex-center">
      <div class="left">
        <h2>扫描二维码</h2>
        <p>浏览更多材料信息</p>
      </div>
      <div class="right">
        <img class="qrcode" v-show="qrcodeDataUrl" :src="qrcodeDataUrl" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { fetchMaterial } from '@/api/material';
import { MaterialDetail, MaterialListItem, RenderingInfoItem } from '@/models/Material';
// import { url2ImageUrl } from '@/utils/qrcode';
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, onMounted, watch,
} from 'vue';
import { getMaterialImg } from '../../material/utils';
import { isLoadedEnd } from './utils';

export default defineComponent({
  name: 'single-share-content',
  components: {},
  props: {
    material: {
      type: Object as PropType<MaterialListItem>,
      required: true,
    },
    qrcodeDataUrl: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      materialDetail: {} as MaterialDetail,
      // qrcodeDataUrl: '',
      materialImg: computed(() => getMaterialImg(props.material) || require('@/assets/img/public/render-empty.png')),
      materialImgLoaded: false,
    });

    const attributeInfo = computed(() => state.materialDetail?.attributeInfo || {});

    const loadedEnd = computed(() => {
      return !!(state.materialImgLoaded);
    });
    watch(loadedEnd, (value) => {
      isLoadedEnd.value = value;
    });
    const renderingInfo = computed(() => {
      return state.materialDetail.renderingInfo || [];
    });
    const showRenderingInfo = computed(() => renderingInfo.value.slice(0, 10));
    const bgStyle = {
      backgroundImage: `url(${require('@/assets/img/share/bg-top.png')}),url(${require('@/assets/img/share/bg-bottom.png')})`,
    };
    const getColorStyle = (color: RenderingInfoItem) => {
      return {
        backgroundColor: color.colorInfo,
      };
    };

    onMounted(async () => {
      state.materialDetail = (await fetchMaterial(props.material.catalogId)).data;
      // state.qrcodeDataUrl = await url2ImageUrl(`ideation://material_detail?id=${props.material.id}`, {
      //   level: 'Q',
      //   padding: 0,
      // });
    });
    return {
      ...toRefs(state), attributeInfo, loadedEnd, renderingInfo, showRenderingInfo, bgStyle, getColorStyle,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.share-content {
  .header {
    padding-top: 20px;
  }
  .footer {
    padding-bottom: 12px;
  }
  .share-main {
    margin: 0 10px;
    .detail {
      position: relative;
      padding-top: 100%;
      border-radius: 5px;
      overflow: hidden;
      /deep/.el-image {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
    }
    .detail-main-bottom {
      padding: 0 10px;
    }
    .color-card-list {
      display: flex;
      justify-content: center;
      border-bottom: 1px solid #dee2e9;
      padding: 15px 0;
      .color-card {
        width: 20px;
        height: 20px;
        border-radius: 3px;
        overflow: hidden;
        flex-shrink: 0;
        + .color-card {
          margin-left: 8px;
        }
        &.hide-more {
          width: auto;
          min-width: 20px;
          background: #00bfa8;
          color: white;
          font-size: 12px;
          div {
            height: 100%;
            transform: scale(0.8);
            white-space: nowrap;
          }
        }
      }
    }
    .title {
      margin: 20px 0 8px 0;
      font-size: 17px;
    }
    .info {
      color: #999999;
      margin-bottom: 15px;
      .supplier {
        letter-spacing: 1px;
        font-size: 13px;
      }
      .price-wrap {
        .price {
          color: #ff690e;
          font-size: 15px;
        }
        .price-unit {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
