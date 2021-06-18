<script lang="tsx">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
} from 'vue';
import { delay } from '@4dst-saas/public-utils/dist/delay';
import { dialog } from '@/utils/vue/dialog';
import MaterialViewer from '@/pages/components/material/viewer/index.vue';
import Video from '@/components/video/index.vue';
import { ElCascader } from 'element-plus';
import ColorPicker from './ColorPicker.vue';

const MediaCarousel = defineComponent({
  name: 'MediaCarousel',
  props: {
    material: {
      type: Object,
      required: true,
    },
    swiperList: {
      type: Array as () => { type: string, url: string }[],
      required: true,
    },
    catalogId: {
      type: String,
      required: true,
    },
    initialIndex: {
      type: Number,
      default: 0,
    },
    withColorPicker: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const carousel = ref<InstanceType<typeof ElCascader>>();
    const state = reactive({
      currentColorIndex: 0,
      modelLoadedList: [] as any,
    });


    async function changeIndex(index: number) {
      if (props.swiperList[index].type === 'model') {
        if (!state.modelLoadedList.includes(index)) {
          await delay(500);
          state.modelLoadedList.push(index);
        }
      }
    }

    return {
      ...toRefs(state),
      carousel,
      changeIndex,
    };
  },

  render() {
    const {
      material,
      catalogId,
      initialIndex,
      swiperList,
      withColorPicker,
      currentColorIndex,
      changeIndex,
      carousel,
    } = this;
    const ImageView = (props: { item: { url: any; }; }) => {
      return [
        <base-image
          fit="contain"
          src={props.item?.url}
          class="material-img">
        </base-image>,
      ];
    };
    const VideoView = (props: { item: { url: string; }; }) => {
      return <div class="material-video">
        <Video src={props.item?.url} />
      </div>;
    };
    const handleClickColor = () => {
      (carousel as any).setActiveItem(0);
    };

    const toViewerPage = async () => {
      await dialog({
        is: MaterialViewer,
        props: {
          catalogId,
        },
      });
    };

    return <div class="flex-1 flex-column material-carousel-container">
      <el-carousel
        initial-index={initialIndex}
        autoplay={false}
        ref="carousel"
        {...{ attrs: this.$attrs }}
        class={`flex-1 ${swiperList.length > 1 ? '' : 'hideControl'}`}
        onChange={(index: number) => changeIndex(index)}>
        {
          swiperList.map((item, index) => {
            switch (item.type) {
              case 'image': {
                return <el-carousel-item>
                  <ImageView item={item}></ImageView>
                </el-carousel-item>;
              }
              case 'video': {
                return <el-carousel-item>
                  <VideoView item={item}></VideoView>
                </el-carousel-item>;
              }
              default: return <ImageView item={item}></ImageView>;
            }
          })
        }
      </el-carousel>
      {
        withColorPicker ? <div class="flex-center" style="height:90px">
          <ColorPicker
            {...this.$attrs}
            style="width: 600px; padding: 20px 0;"
            items={material?.renderingInfo || []}
            current={currentColorIndex}
            onClickItem={handleClickColor}
          ></ColorPicker>
        </div> : null
      }
      <el-tooltip content="3D预览" effect="light" placement="bottom" popper-class='detail-btn-tooltip'>
        <div class='viewer-icon' onClick={toViewerPage}>
          <i class='i-r-moxing-12'></i>
        </div>
      </el-tooltip>
    </div>;
  },
});

export default MediaCarousel;
</script>

<style lang="scss">
.material-carousel-container {
  width: 100%;
  background-color: #f2f3f5;
  position: relative;
  .el-carousel__container {
    height: 100%;
    .el-carousel__item {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .el-carousel {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    .el-carousel__arrow {
      background-color: rgba(30, 30, 30, 0.3);
      color: #cdcdcd;
      font-size: 26px;
      width: 40px;
      height: 40px;
      // line-height: 40px;
      box-shadow: 0px 0px 12px 0px rgba(160, 169, 187, 0.3);
      &:hover {
        color: #dfdfdf;
        background-color: rgba(30, 30, 30, 0.4);
      }
    }
    .el-carousel__arrow--left {
      left: 4%;
      .el-icon-arrow-right {
        font-size: 26px;
      }
    }
    .el-carousel__arrow--right {
      right: 4%;
    }
    .el-carousel__indicators {
      height: 14px;
      background-color: rgba(30, 30, 30, 0.4);
      border-radius: 9px;
      bottom: 10px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-carousel__indicator {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: rgba(216, 216, 216, 0.4);
        padding: 0;
        margin: 4px 6px;
        &:first-child {
          margin-left: 14px;
        }
        &:last-child {
          margin-right: 14px;
        }
        &.is-active {
          width: 10px;
          height: 10px;
          opacity: 0.7;
          border: 1px solid #ffffff;
          border-radius: 50%;
          background: none;
          position: relative;
          &::before {
            content: "";
            width: 3px;
            height: 3px;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.7);
          }
        }
        .el-carousel__button {
          display: none;
        }
      }
    }
    .material-img {
      margin: auto;
      width: 100%;
      height: 100%;
    }
    .material-video {
      position: relative;
      margin: auto;
      width: 100%;
      height: 100%;
      .i-r-shipin-14 {
        position: absolute;
        left: 10px;
        top: 10px;
        font-size: 24px;
        color: #b9bdc2;
        z-index: 2;
      }
    }
    .material-model {
      position: relative;
      margin: auto;
      width: 100%;
      height: 100%;
      .icon-magnify__model {
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 2;
      }
      .iconmoxing {
        position: absolute;
        left: 10px;
        top: 10px;
        font-size: 24px;
        color: #b9bdc2;
        z-index: 2;
      }
    }
    .img-scale {
      height: 100%;
      right: 10%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: 0;
      object-fit: contain;
      .scale-text {
        user-select: none;
        color: #222222;
        font-size: 21px;
        text-align: center;
        background: #ffffff;
        border: 1px solid #676767;
        border-radius: 20px;
        margin: 9px 0;
        padding: 6px;
        width: 76px;
      }
    }
    &.hideControl {
      .el-carousel__arrow {
        display: none;
      }
      .el-carousel__indicators {
        display: none;
      }
    }
  }
  .iconfenxiang-24 {
    cursor: pointer;
    position: absolute;
    font-size: 16px;
    left: 18px;
    top: 18px;
  }
  .viewer-icon {
    position: absolute;
    right: 12px;
    top: 12px;
    width: 32px;
    height: 32px;
    background: rgba(30, 30, 30, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    cursor: pointer;
    z-index: 999;
  }
}
</style>
<style lang="scss">
.detail-btn-tooltip {
  padding: 3px 10px;
  color: #666666;
  z-index: 999;
}
.material-carousel-container {
  .el-carousel__container {
    .el-carousel__item {
      display: flex !important;
    }
  }
}
</style>

