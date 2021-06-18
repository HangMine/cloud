<template>
  <div class="renderer">
    <canvas @dragover.prevent.stop @drop.prevent.stop v-on="canvasEvent" ref="previewer" />
    <!-- 渲染进度条 -->
    <ModelRenderingProgress :isMobile="isMobile" :info="renderingProgressInfo" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, ref, toRefs, onMounted,
} from 'vue';
import localforage from 'localforage';
import { normalizeComponent, normalizeMaterial } from '@/utils/normalize-rendering-data';
import Viewer from '@4dst-render/viewer.js/dist/ViewerSrc'; // 测试阶段使用ViewerSrc
import { getModelCTMList } from '@/api/viewer';
import envSettingData from './const/settingData';
import ModelRenderingProgress from './components/ModelRenderingProgress.vue';

export default defineComponent({
  name: 'renderer',
  components: {
    ModelRenderingProgress,
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const previewer = ref();
    const state = reactive({
      renderingProgressInfo: {},
      renderingInfo: {} as any,
    });
    let viewer = null as any; // 不能挂置在state上面,会报错:viewer里面用了Object.defineProperty,怀疑跟vue的proxy兼容不到位导致报错
    const canvasEvent = {
      click: async (e: MouseEvent) => {
        console.log('click');
      },
      dblclick: async (e: MouseEvent) => {
        console.log('dblclick');
      },
      touchstart: (e: TouchEvent) => {
        console.log('touchstart');
        e.preventDefault();
        e.stopPropagation();
        const controlsTouchMove = (_e: TouchEvent) => {
          e.preventDefault();
          e.stopPropagation();
          viewer.controlsTouchMove(_e);
          viewer.controlsMoveRender(_e);
        };

        const controlsTouchEnd = async () => {
          e.preventDefault();
          e.stopPropagation();
          viewer.controlsTouchEnd();
          viewer.render();
          document.removeEventListener('touchmove', controlsTouchMove, false);
          document.removeEventListener('touchend', controlsTouchEnd, false);
        };

        const isStart = viewer.controlsTouchStart(e);

        if (isStart) {
          document.addEventListener('touchmove', controlsTouchMove, false);
          document.addEventListener('touchend', controlsTouchEnd, false);
        }
      },
      mousedown: (e: MouseEvent) => {
        console.log('mousedown');
        const controlsMouseMove = (_e: MouseEvent) => {
          viewer.controlsMouseMove(_e);
          viewer.controlsMoveRender(_e);
        };

        const controlsMouseUp = async () => {
          viewer.controlsMouseUp();
          viewer.render();
          document.removeEventListener('mousemove', controlsMouseMove, false);
          document.removeEventListener('mouseup', controlsMouseUp, false);
        };

        const isStart = viewer.controlsMouseDown(e);

        if (isStart) {
          document.addEventListener('mousemove', controlsMouseMove, false);
          document.addEventListener('mouseup', controlsMouseUp, false);
        }
      },
      wheel: (e: MouseEvent) => {
        console.log('wheel');
        e.preventDefault();
        e.stopPropagation();
        viewer.controlsMouseWheel(e);
        viewer.render();
      },
      contextmenu: (e: MouseEvent) => {
        console.log('contextmenu');
        e.preventDefault();
      },
    };
    const init = () => {
      const canvasDom = previewer.value;
      canvasDom.width = canvasDom.clientWidth;
      canvasDom.height = canvasDom.clientHeight;
      // eslint-disable-next-line no-undef
      viewer = new Viewer({
        canvas: canvasDom,
        width: canvasDom.clientWidth,
        height: canvasDom.clientHeight,
        resolution: window.devicePixelRatio,
        envSetting: envSettingData,
        isMobile: props.isMobile,
      });
    };
    const resizeRenderer = () => {
      const canvasDom = previewer.value;
      viewer.resizeRenderer(canvasDom.clientWidth, canvasDom.clientHeight, window.devicePixelRatio);
    };
    const getModelDataFromID = async (modelId: string) => {
      const modelData = (await getModelCTMList(modelId))?.data;
      const modelComponents = await Promise.all(modelData.map((item: any) => normalizeComponent(item)));
      return modelComponents;
    };
    const initModel = async (modelId: string) => {
      const modelComponents = await getModelDataFromID(modelId);
      // Mobile
      if (props.isMobile) {
        return viewer.loadModel(modelComponents, (info: any) => {
          state.renderingProgressInfo = info;
        }).then(() => {
          resizeRenderer();
        });
      }
      // PC
      return localforage.getItem(modelId).then(steamData => {
        if (steamData) {
          return viewer.loadModel(modelComponents, (info: any) => {
            state.renderingProgressInfo = info;
          }, steamData).then(() => {
            resizeRenderer();
          });
        }
        return viewer.loadModel(modelComponents, (info: any) => {
          state.renderingProgressInfo = info;
        }).then(() => {
          resizeRenderer();
          const data = viewer.getLoadedModelStreamData();
          localforage.setItem(modelId, data);
        });
      }).catch(err => {
        console.warn('不支持本地缓存：', err);
        return viewer.loadModel(modelComponents, (info: any) => {
          state.renderingProgressInfo = info;
        }).then(() => {
          resizeRenderer();
        });
      });
    };
    const initMaterialInfo = async (material: any) => {
      state.renderingInfo = await normalizeMaterial({
        ...material,
        id: material.id,
        name: material.name,
      });
      console.log('state.renderingInfo', state.renderingInfo);
    };
    const resetControls = () => {
      viewer.resetControls();
    };
    const restoreDefaultMaterial = () => {
      return viewer.restoreDefaultMaterial();
    };
    const applyMaterialToComponents = (targets: any, colorInfo: string) => {
      return viewer.changeTargetComponentsMaterial(targets, state.renderingInfo, colorInfo);
    };
    const setMaterialColor = (color: string) => {
      viewer.setMaterialColor(color);
    };
    const reloadModel = async (modelId: string) => {
      const modelComponents = await getModelDataFromID(modelId);
      // Mobile
      if (props.isMobile) {
        return viewer.reloadModel(modelComponents, (info: any) => {
          state.renderingProgressInfo = info;
        });
      }
      // PC
      return localforage.getItem(modelId).then(steamData => {
        if (steamData) {
          return viewer.reloadModel(modelComponents, (info: any) => {
            state.renderingProgressInfo = info;
          }, steamData);
        }
        return viewer.reloadModel(modelComponents, (info: any) => {
          state.renderingProgressInfo = info;
        }).then(() => {
          const data = viewer.getLoadedModelStreamData();
          localforage.setItem(modelId, data);
        });
      }).catch(err => {
        console.warn('不支持本地缓存：', err);
        return viewer.reloadModel(modelComponents, (info: any) => {
          state.renderingProgressInfo = info;
        });
      });
    };
    const dispose = () => {
      viewer.dispose();
    };
    onMounted(async () => {
      init();
    });
    return {
      ...toRefs(state),
      previewer,
      canvasEvent,
      resetControls,
      resizeRenderer,
      restoreDefaultMaterial,
      applyMaterialToComponents,
      setMaterialColor,
      reloadModel,
      initModel,
      dispose,
      initMaterialInfo,
    };
  },
});

</script>
<style lang="scss" scoped>
.renderer {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>


