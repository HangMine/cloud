<template>
  <div v-loading="loading" class="material-detail">
    <div class="ctrl-bar">
      <el-tooltip content="关闭" effect="light">
        <i class="el-icon-close" @click="$emit('confirm')"></i>
      </el-tooltip>
      <el-divider direction="vertical"></el-divider>
      <el-tooltip v-if="editable && !isBuyer" content="编辑" effect="light">
        <i class="i-r-bianji" @click="openEditDialog()"></i>
      </el-tooltip>
    </div>

    <ComponentPreviewDetail
      v-if="!loading"
      :material="material"
      :catalogId="row?.catalogId"
      :materialTypeContent="materialTypeContent"
      :swiper-list="swipers"
      @click-item="onChangeColorCard"
    />
  </div>
</template>

<script lang="ts">
import { dialog } from '@/utils/vue/dialog';
import MaterialEditComp from '@/pages/components/material/edit/index.vue';
import { MaterialDetail, MaterialListItem } from '@/models/Material';
import {
  fetchMaterial, fetchHistoryMaterial, fetchCategoryList, HistoryVersion,
} from '@/api/material';
import {
  defineComponent, reactive, computed, ref, toRefs, PropType,
} from 'vue';
import onCreated from '@/utils/vue/onCreated';
import usePermisson from '@/utils/uses/use-permisson';
import ComponentPreviewDetail from '../components/ComponentPreviewDetail.vue';

export default defineComponent({
  name: 'MaterialInfo',
  dialogify: {
    noTitle: true,
    props: {
      title: '材料详情',
      width: '1100px',
      showClose: false,
      closeOnClickModal: false,
      customClass: 'no-padding with-common-border-radius',
    },
  },
  components: {
    ComponentPreviewDetail,
  },
  props: {
    row: {
      type: Object as PropType<MaterialListItem>,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    historyVersion: {
      type: Object as PropType<HistoryVersion>,
    },
  },
  emits: ['confirm'],
  setup(props, { emit }) {
    const state = reactive({
      currentComponent: 'ComponentPreviewDetail' as 'ComponentPreviewDetail' | 'ComponentEditDetail',
      swipers: [],
      colorCardList: [],
      loading: false,
      material: {} as MaterialDetail,
      materialTypeContent: '',
    });

    const { isBuyer } = usePermisson();

    function getAttachmentSwiperObj(material) {
      const { enclosureInfo } = material;
      if (!enclosureInfo) return;
      // 附件图片
      if (enclosureInfo?.images?.length) {
        enclosureInfo.images.forEach(imageInfo => {
          state.swipers.push({ type: 'image', url: imageInfo.url });
        });
      }
      // 附件视频
      if (enclosureInfo?.videos?.length) {
        enclosureInfo.videos.forEach(videoInfo => {
          state.swipers.push({ type: 'video', url: videoInfo.url });
        });
      }
    }

    function getDefaultSwiperObj(material) {
      const { renderingInfo } = material;
      if (!renderingInfo?.length) return;
      state.swipers = [];
      // isDefault优先显示
      renderingInfo.forEach(info => {
        if (info.isDefault === 1 && info?.imgInfo) {
          Object.keys(info.imgInfo).forEach(key => {
            // 详情目前只显示imgUrl_crease这一张
            if (key !== 'imgUrl_crease_v2') return;
            const imageURL = info.imgInfo[key];
            if (imageURL) state.swipers.push({ type: 'image', url: imageURL });
          });
        }
      });
      if (state.swipers.length) return;
      // 否则采样数组第一个
      if (renderingInfo[0]?.imgInfo) {
        Object.keys(renderingInfo[0].imgInfo).forEach(key => {
          if (key !== 'imgUrl_crease_v2') return;
          const imageURL = renderingInfo[0].imgInfo[key];
          if (imageURL) state.swipers.push({ type: 'image', url: imageURL });
        });
      }
    }

    function changeColorCardSwiperObj(colorCardInfo) {
      state.swipers = [];
      if (colorCardInfo?.imgInfo) {
        Object.keys(colorCardInfo.imgInfo).forEach(key => {
          // 详情目前只显示imgUrl_crease这一张
          if (key !== 'imgUrl_crease_v2') return;
          const imageURL = colorCardInfo.imgInfo[key];
          if (imageURL) state.swipers.push({ type: 'image', url: imageURL });
        });
      }
      getAttachmentSwiperObj(state.material);
    }

    function onChangeColorCard(colorInfo) {
      console.log('onChangeColorCard!', colorInfo);
      changeColorCardSwiperObj(colorInfo);
    }

    function getMaterialTypeContent(materialTypeList) {
      let res = '';
      if (materialTypeList?.length) {
        materialTypeList.forEach((info, index) => {
          if (info.name) res += `${info.name}${index === materialTypeList.length - 1 ? '' : '/'}`;
        });
      }
      return res;
    }

    async function getMaterialInfoById(catalogId: string, categoryId: string) {
      state.loading = true;
      try {
        state.material = props.historyVersion
          ? (await fetchHistoryMaterial(props.historyVersion.relateId)).data
          : (await fetchMaterial(catalogId)).data;
        state.materialTypeContent = getMaterialTypeContent(await fetchCategoryList(categoryId));
        getDefaultSwiperObj(state.material);
        getAttachmentSwiperObj(state.material);
      } finally {
        state.loading = false;
      }
    }

    async function openEditDialog() {
      await dialog({
        is: MaterialEditComp,
        props: {
          material: props.row,
        },
      });
      getMaterialInfoById(props?.row?.catalogId, props?.row?.categoryId);
    }

    onCreated(() => getMaterialInfoById(props?.row?.catalogId, props?.row?.categoryId));
    return {
      ...toRefs(state),
      isBuyer,
      openEditDialog,
      onChangeColorCard,
    };
  },
});
</script>
<style lang="scss" scoped>
.ctrl-bar {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  .el-divider {
    margin: 0 8px;
    background: #dddddd;
  }
  .el-icon-close {
    font-size: 16px;
    cursor: pointer;
    color: #999999;
    outline: none;
  }
  .i-r-bianji {
    cursor: pointer;
    color: #9ca0a4;
    outline: none;
  }
}
.material-detail {
  position: relative;
  background: #ffffff;
  height: 700px;
}
</style>
