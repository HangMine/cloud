<template>
  <div class="material-upload">
    <reactive-loading :visible="loading" :text="loadingText || uploadedPercentage"></reactive-loading>
    <Steps class="material-steps" v-model="step">
      <Step>选择文件</Step>
      <Step>添加色卡</Step>
      <Step>填写信息</Step>
    </Steps>

    <div v-show="step === 0" class="upload-files">
      <Upload
        v-model="fileForm.material"
        :options="{ types: ['4ddat'] }"
        :validOptions="['material']"
        :defaultImg="require('@/assets/img/file/4ddat.png')"
      >
        <template #default="{ upload, url, close }">
          <div class="upload-main">
            <div class="upload-main-content">
              <template v-if="url">
                <div class="img" :style="{ backgroundImage: `url('${url}')` }" />
                <p class="upload-title">{{ fileForm.material?.name || "" }}</p>
                <el-button class="upload-btn" @click="upload">重新上传</el-button>
                <i class="close-icon hover-link el-icon-close" @click.stop="close"></i>
              </template>
              <template v-else>
                <div class="icon-wrap">
                  <i class="i-l-shangchuantubiao-34"></i>
                </div>
                <h3 class="upload-title bold">拖拽材料文件到这里</h3>
                <p class="upload-des">仅支持4ddat文件格式</p>
                <el-button class="upload-btn" type="primary" @click="upload">选择文件</el-button>
              </template>
            </div>
          </div>
        </template>
      </Upload>
      <ul class="card-container">
        <li>
          <ListCard type="img" :isEmpty="!fileForm.imgList.length" @click-empty="clickImgEmpty()">
            <UploadList v-model="fileForm.imgList" :maxLength="6" ref="imgUploadListVm">
              <template #append="{ item }">
                <over-text class="upload-title">{{ item.name }}</over-text>
              </template>
            </UploadList>
          </ListCard>
        </li>
        <li>
          <ListCard type="video" :isEmpty="!fileForm.videoList.length" @click-empty="clickVideoEmpty()">
            <VideoList v-model="fileForm.videoList" :maxLength="3" ref="videoUploadListVm">
              <template #append="{ item }">
                <over-text class="upload-title">{{ item.name }}</over-text>
              </template>
            </VideoList>
          </ListCard>
        </li>
        <li>
          <ListCard type="file" :isEmpty="!fileForm.fileList.length" @click-empty="clickFileEmpty()">
            <FileList v-model="fileForm.fileList" :validate="validateFiles" ref="fileUploadListVm">
              <template #append="{ item }">
                <over-text class="upload-title">{{ item.name }}</over-text>
              </template>
            </FileList>
          </ListCard>
        </li>
      </ul>
    </div>

    <ColorCard v-show="step === 1" v-model="colorInfos" ref="colorCardVm"></ColorCard>

    <MaterialForm v-show="step === 2" isAdd ref="materialFormVm" :visible="step === 2"></MaterialForm>

    <div class="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="step !== 0" @click="prevStep">上一步</el-button>
      <el-button type="primary" :disabled="confirmBtn.disabled" :loading="loading" @click="confirm">{{
        confirmBtn.title
      }}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, toRef,
} from 'vue';
import Steps from '@/components/steps/index.vue';
import Step from '@/components/steps/Step.vue';
import Upload from '@/components/form/upload/index.vue';
import UploadList from '@/components/form/upload/UploadList.vue';
import VideoList from '@/components/form/upload/VideoList.vue';
import FileList from '@/components/form/upload/FileList.vue';
import * as api from '@/api/material';
import { dialog } from '@/utils/vue/dialog';
// eslint-disable-next-line import/no-self-import
import parseMaterialFile from '@/utils/materialFileLoader';
import AppError from '@/utils/error';
import {
  UploadItems,
} from '@/components/form/upload/utils';
import MaterialForm from '../components/MaterialForm/index.vue';
import ColorCard from '../components/ColorCard/index.vue';
import {
  Color, Colors, getDefaultColor, getColorSystem,
} from '../components/ColorCard/utils';
import {
  getRenderingInfo, getEnclosureInfo, failList, validateFiles, loading, getUploadSizeStat, uploadedPercentage, handle4ddatChage,
} from '../utils';
import UploadResult from '../components/UploadResult/index.vue';
import ListCard from './components/ListCard.vue';
import ReactiveLoading from './components/ReactiveLoading.vue';

export default defineComponent({
  name: 'material-upload',
  dialogify: {
    props: {
      title: '上传材料',
      width: '1200px',
      closeOnClickModal: false,
    },
  },
  components: {
    Steps, Step, Upload, UploadList, VideoList, ListCard, FileList, ColorCard, MaterialForm, ReactiveLoading,
  },
  props: {},
  emits: ['cancel', 'confirm'],
  setup(props, { emit }) {
    const imgUploadListVm = ref<InstanceType<typeof UploadList>>();
    const videoUploadListVm = ref<InstanceType<typeof VideoList>>();
    const fileUploadListVm = ref<InstanceType<typeof FileList>>();
    const colorCardVm = ref<InstanceType<typeof ColorCard>>();
    const materialFormVm = ref<InstanceType<typeof MaterialForm>>();

    const state = reactive({
      step: 0,
      fileForm: {
        material: undefined as File | undefined,
        imgList: [] as UploadItems,
        videoList: [] as UploadItems,
        fileList: [] as UploadItems,
      },
      colorInfos: [] as Colors,
      loadingText: '',
    });


    watch(() => state.fileForm.material, async (materialFile) => {
      try {
        loading.value = true;
        await handle4ddatChage(materialFile, toRef(state, 'colorInfos'));
      } finally {
        loading.value = false;
      }
    });
    const confirmBtn = computed(() => {
      const { step, fileForm, colorInfos } = state;
      const {
        material, imgList, videoList, fileList,
      } = fileForm;
      const disabled = step === 1 && !colorInfos.filter(item => !item.isUnfindColor).length;
      let title = '下一步';
      if (step === 2) {
        title = '完 成';
      } else if (step === 0 && !material && !imgList.length && !videoList.length && !fileList.length) {
        title = '跳 过';
      }

      return {
        title, disabled,
      };
    });

    const reset = async () => {
      loading.value = false;
      state.step = 0;
      state.fileForm = {
        material: undefined,
        imgList: [],
        videoList: [],
        fileList: [],
      };
      state.colorInfos = [];
      state.loadingText = '';
      if (colorCardVm.value) colorCardVm.value.currentColor = '';
      await materialFormVm.value?.reset();
    };

    const nextStep = (step?: number) => {
      state.step = step ?? (state.step + 1);
    };
    const clickImgEmpty = async () => {
      await imgUploadListVm.value?.uploadVm?.upload();
    };
    const clickVideoEmpty = async () => {
      await videoUploadListVm.value?.uploadListVm?.uploadVm?.upload();
    };
    const clickFileEmpty = async () => {
      await fileUploadListVm.value?.uploadListVm?.uploadVm?.upload();
    };
    const cancel = () => {
      emit('cancel');
    };
    const prevStep = () => {
      state.step--;
    };

    const submit = async () => {
      try {
        loading.value = true;
        const uploadSizeStat = getUploadSizeStat(state.fileForm);
        uploadSizeStat.getTotalSize();
        const { form2ApiParams } = materialFormVm.value;
        const attributeInfo = await form2ApiParams();
        const uploadOssKeys = await getEnclosureInfo(state.fileForm, (...args) => {
          uploadSizeStat.addUploadedSize(args);
          console.log(uploadedPercentage.value);
        });
        const renderingInfo = await getRenderingInfo({
          colorInfos: state.colorInfos,
          onUpload: (...args) => {
            // console.log('getRenderingInfo', args);
            uploadSizeStat.addUploadedSize(args);
            // state.uploadedPercentageText = uploadSizeStat.getUploadedPercentage();
            console.log(uploadedPercentage.value);
          },
          onParseStart: () => {
            state.loadingText = '解析中...';
          },
          onParseEnd: () => {
            state.loadingText = '';
          },
        });
        const apiParams = {
          renderingInfo,
          enclosureInfo: uploadOssKeys,
          attributeInfo: {
            ...attributeInfo,
            hasFile: state.fileForm.material ? 1 : 0,
          },
        };

        if (!failList.length) {
          // 没有失败的文件才执行上传
          await api.uploadMaterial(apiParams);
        }
        try {
          await dialog({
            is: UploadResult,
            props: {
              failList,
            },
          });
          // 成功:重新上传
          await reset();
        } catch (err) {
          if (err instanceof AppError) {
            if (err?.isClose) {
              // 直接关闭
              emit('confirm');
            } else {
              // 失败:再试一次
              state.step = 0;
            }
          } else {
            throw err;
          }
        } finally {
          failList.splice(0, failList.length);
        }
      } finally {
        loading.value = false;
      }
    };
    const confirm = async () => {
      if (state.step === 2) {
        await submit();
      } else {
        nextStep();
      }
    };

    return {
      ...toRefs(state),
      loading,
      uploadedPercentage,
      nextStep,
      imgUploadListVm,
      videoUploadListVm,
      fileUploadListVm,
      materialFormVm,
      colorCardVm,
      clickImgEmpty,
      clickVideoEmpty,
      clickFileEmpty,
      cancel,
      prevStep,
      confirm,
      confirmBtn,
      validateFiles,
    };
  },
});
</script>
<style lang="scss">
.upload-wrap.is-dragover {
  .upload-main {
    border-color: $color-primary;
    .upload-main-content {
      color: $color-primary;
    }
  }
}
.upload-main {
  // 跟color-card共用样式
  display: flex;
  justify-content: center;
  align-items: center;
  height: 292px;
  color: #7f7f7f;
  border: 1px solid #dddddd;
  border-radius: 4px;
  background: #fcfcfc;
  margin-bottom: 12px;

  .upload-main-content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transition: color 0.2s;
    // cursor: pointer;

    &:hover {
      // color: $color-primary;
      // border-color: $color-primary;
    }

    .icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background-color: #eeeeef;
      border-radius: 50%;
      i {
        font-size: 34px;
      }
    }
    .img {
      width: 80px;
      height: 80px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .upload-title {
      margin-top: 12px;
      font-size: 12px;
      &.bold {
        font-size: 14px;
        font-weight: 500;
        color: #222222;
      }
    }
    .upload-des {
      font-size: 12px;
      color: #999999;
      margin-top: 8px;
    }
    .upload-btn {
      margin-top: 20px;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      right: -20px;
      top: -20px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss" scoped>
// @import 'url'
.material-upload {
  // width: 1200px;
  margin: 0 auto;
  position: relative;
  .material-steps {
    margin: 20px 0 40px 0;
  }
  /deep/ .upload-wrap {
    height: 100%;
  }
  .card-container {
    display: flex;
    /deep/.upload-title {
      margin-top: 6px;
      font-size: 12px;
    }
    li {
      flex: 1;
      + li {
        margin-left: 12px;
      }
    }
  }
  .footer {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
