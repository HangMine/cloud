<template>
  <div class="material-box">
    <div class="thumbnail" @click="handleClickItem">
      <BaseImage class="material-img" fit="cover" :src="imgUrl" lazy />

      <span
        v-if="canShareAgain"
        class="icon-wrapper icon-check"
        :class="{ 'is-checked': materialItemRef.isChecked }"
        @click.stop="handleCheckItem"
      >
        <i class="icon i-s-wancheng-16"></i>
      </span>
      <span
        class="icon-wrapper icon-collect"
        :class="{ 'is-collected': materialItemRef.isCollect }"
        @click.stop="handleCollectItem"
      >
        <el-tooltip
          :content="materialItemRef.isCollect ? '取消收藏' : '收藏'"
          placement="bottom"
          effect="light"
          :visible-arrow="false"
          popper-class="material-collect-tooltip"
        >
          <i class="icon-tip" :class="materialItemRef.isCollect ? 'i-s-shoucangon-12' : 'i-r-shoucang-12'"></i>
        </el-tooltip>
      </span>
      <span class="icon-wrapper icon-share" v-if="canShareAgain" @click.stop="handleShareItem">
        <el-tooltip
          content="分享"
          placement="bottom"
          effect="light"
          :visible-arrow="false"
          popper-class="material-share-tooltip"
        >
          <i class="icon-tip i-r-fenxiang-12"></i>
        </el-tooltip>
      </span>
    </div>
    <h4>{{ materialItemRef.name }}</h4>
    <p>{{ materialItemRef.sn }}</p>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed,
} from 'vue';
import BaseImage from '@/components/base/Image.vue';
import { SharedMaterialItem } from '@/models/Material';
import { getMaterialImg } from '@/pages/components/material/utils';


export default defineComponent({
  name: 'thumbnail',
  components: {
    BaseImage,
  },
  props: {
    // imgUrl: {
    //   type: String,
    //   required: true,
    // },
    // name: {
    //   type: String,
    //   default: '',
    // },
    // sn: {
    //   type: String,
    //   default: '',
    // },
    // isChecked: {
    //   type: Boolean,
    //   default: false,
    // },
    // isCollect: {
    //   type: Boolean,
    //   default: false,
    // },
    index: {
      type: Number,
      required: true,
    },
    materialItem: {
      type: Object as PropType<SharedMaterialItem>,
      required: true,
    } as const,
    canShareAgain: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['check', 'collect', 'detail', 'share'],
  setup(props, { emit }) {
    // const isChecked = ref(props.materialItem!.isChecked);
    // const isCollect = ref(props.materialItem!.isChecked);
    const materialItemRef = computed<SharedMaterialItem>(() => {
      return props.materialItem;
    });
    const imgUrl = computed(() => getMaterialImg(props.materialItem) || require('@/assets/img/public/render-empty.png'));
    const handleCheckItem = () => {
      emit('check', props.index, props.materialItem);
    };
    const handleCollectItem = () => {
      emit('collect', props.index, props.materialItem);
    };
    const handleShareItem = () => {
      emit('share', [props.materialItem]);
    };
    const handleClickItem = () => {
      emit('detail', props.materialItem);
    };

    return {
      imgUrl,
      // imgUrl: props.materialItem!.imgUrl,
      // name: props.materialItem!.name,
      // sn: props.materialItem!.sn,
      // isChecked,
      // isCollect,
      handleCheckItem,
      handleCollectItem,
      handleClickItem,
      handleShareItem,
      materialItemRef,

    };
  },
});
</script>

<style lang="scss" scoped>
.material-box {
  // min-width: 236px;
  // max-width: 250px;
  margin-bottom: 20px;
}
.thumbnail {
  // width: 216px;
  // height: 216px;
  padding-bottom: 100%;
  // background-size: cover;
  border-radius: 8px;
  position: relative;
  .el-image {
    position: absolute;
  }
  &:hover {
    box-shadow: 0 68px 34px -34px rgba(0, 0, 0, 0.45) inset;
    .icon-wrapper {
      display: flex;
    }
  }
}
.icon-wrapper {
  display: none;
  position: absolute;
  cursor: pointer;
}
.icon-check {
  top: 12px;
  left: 12px;
  background-color: #fff;
  border-radius: 50%;
  i {
    font-size: 24px;
    color: #a1ebdf;
  }
  &.is-checked {
    display: flex;
    i {
      color: #14ccb0;
    }
  }
}
.icon-share,
.icon-collect {
  top: 8px;
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  @extend %flex-center;

  i {
    color: #666;
    font-size: 18px;
  }
}
.icon-share {
  right: 48px;
}
.icon-collect {
  right: 8px;
  &.is-collected {
    display: flex;
    i {
      color: #ff6678;
    }
  }
}
h4 {
  font-size: $font-size-small;
  line-height: 24px;
  margin-top: 4px;
}
p {
  font-size: $font-size-mini;
  line-height: 18px;
  color: #999;
}
</style>

<style lang="scss">
.material-collect-tooltip,
.material-share-tooltip {
  padding: 3px 10px;
}
</style>
