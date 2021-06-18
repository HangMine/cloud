<template>
  <div class="material-edit">
    <reactive-loading :visible="loading" :text="loadingText || uploadedPercentage"></reactive-loading>
    <div class="nav">
      <ul>
        <li
          v-for="(nav, i) of navs"
          :key="i"
          class="nav-item"
          :class="{ 'is-active': nav.isActive }"
          @click="handleClickNav(i, nav)"
        >
          <span>{{ nav.title }}</span>
        </li>
      </ul>
    </div>
    <div class="content" ref="contentVm">
      <HScroll height="65vh" :to="scrollTop" :el="scrollEl" @scroll="onScroll" @scroll-end="scrollEnd" ref="scrollVm">
        <MaterialForm
          :attributeInfo="materialDetail.attributeInfo"
          @categoryChange="categoryChange"
          ref="materialFormVm"
        ></MaterialForm>
        <h3 class="title" h-scroll="材料文件">材料文件</h3>
        <Upload
          v-model="fileForm.material"
          v-model:url="fileForm.materialEnclosureItem.url"
          :options="{ types: ['4ddat'] }"
          :validOptions="['material']"
          :defaultImg="require('@/assets/img/file/4ddat.png')"
          :width="136"
        >
          <template #default="{ url, close, upload }">
            <template v-if="url">
              <div class="edit-material-file has-file">
                <div class="default-upload-file">
                  <img :src="require('@/assets/img/file/4ddat.png')" />
                </div>
                <i class="default-upload-close-icon el-icon-close" @click.stop="close"></i>
              </div>
            </template>
            <template v-else>
              <div class="edit-material-file">
                <div class="default-upload-list-add flex-center" @click="upload">
                  <i class="i-l-tianjia-34"></i>
                </div>
              </div>
            </template>
          </template>
          <template #append>
            <p v-if="fileForm.material || fileForm.materialEnclosureItem" class="upload-title">
              {{ fileForm.material?.name || fileForm.materialEnclosureItem.name }}
            </p>
          </template>
        </Upload>
        <h3 class="title" h-scroll="图片">图片</h3>
        <UploadList v-model="fileForm.imgList" :maxLength="6" :width="136" ref="imgUploadListVm">
          <template #append="{ item }">
            <over-text class="upload-title">{{ item.name }}</over-text>
          </template>
        </UploadList>
        <h3 class="title" h-scroll="视频">视频</h3>
        <VideoList v-model="fileForm.videoList" :maxLength="3" :width="136" ref="videoUploadListVm">
          <template #append="{ item }">
            <over-text class="upload-title">{{ item.name }}</over-text>
          </template>
        </VideoList>

        <h3 class="title" h-scroll="文档">文档</h3>
        <FileList v-model="fileForm.fileList" :validate="validateFiles" :width="136" ref="fileUploadListVm">
          <template #append="{ item }">
            <over-text class="upload-title">{{ item.name }}</over-text>
          </template>
        </FileList>

        <h3 class="title" h-scroll="色卡">色卡+色系</h3>
        <ColorCard v-model="colorInfos" :isEdit="true" ref="colorCardVm"></ColorCard>
        <time-info
          horizatal
          :creator="materialDetail.attributeInfo?.creator"
          :uploaded="materialDetail.attributeInfo?.gmtCreateTime"
          :updated="materialDetail?.attributeInfo?.gmtModifyTime || materialDetail?.attributeInfo?.gmtCreateTime || ''"
          style="margin-top: 20px"
        />
        <!-- <p class="bottom-tip">
          <span
            ><i class="i-r-yigeren-241"></i> 创建者:{{
              userObj[materialDetail.attributeInfo?.creator]?.name || ""
            }}</span
          >
          <span
            ><i class="i-r-shangchuan-24"></i> 上传时间:
            {{ dayjs(materialDetail.attributeInfo?.gmtCreateTime).format("YYYY/MM/DD HH:mm") }}</span
          >
        </p> -->
      </HScroll>
      <div class="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="confirm">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, onMounted, nextTick, watch, toRef,
} from 'vue';
import HScroll from '@/components/scroll/index.vue';
import delay from '_/delay';
import Upload from '@/components/form/upload/index.vue';
import UploadList from '@/components/form/upload/UploadList.vue';
import VideoList from '@/components/form/upload/VideoList.vue';
import FileList from '@/components/form/upload/FileList.vue';
import { UploadItems, UploadItem, apiEnclosureItems2UploadItems } from '@/components/form/upload/utils';
import uploadToOSS from '@/utils/oss/uploadToOSS';
import * as api from '@/api/material';
import { UserObj, getUsersInfoByIds, getUsersObjByIds } from '@/loaders/account';
import Material, { MaterialDetail, MaterialListItem, EnclosureItem } from '@/models/Material';
import dayjs from 'dayjs';
import { FormItems } from '@/components/form/HForm/type';
import { dialog, confirm as dialogConfirm } from '@/utils/vue/dialog';
import AppError from '@/utils/error';
import useUsers from '@/utils/uses/use-users';
import { ElMessage } from 'element-plus';
import parseMaterialFile from '@/utils/materialFileLoader';
import MaterialForm from '../components/MaterialForm/index.vue';
import {
  Color, Colors, getDefaultColor, getColorSystem,
} from '../components/ColorCard/utils';
import ColorCard from '../components/ColorCard/index.vue';
import {
  getRenderingInfo, failList, getEnclosureInfo, validateFiles, getUploadSizeStat, uploadedPercentage, handle4ddatChage,
} from '../utils';
import TimeInfo from '../components/TimeInfo.vue';
import ReactiveLoading from '../upload/components/ReactiveLoading.vue';

export default defineComponent({
  name: 'material-edit',
  dialogify: {
    noTitle: true,
    props: {
      title: '材料编辑',
      width: '1100px',
      customClass: 'material-edit-dialog',
      showClose: false,
    },
  },
  components: {
    MaterialForm, HScroll, Upload, UploadList, VideoList, FileList, ColorCard, TimeInfo, ReactiveLoading,
  },
  props: {
    material: {
      type: Object as PropType<MaterialListItem>,
      required: true,
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const imgUploadListVm = ref<InstanceType<typeof UploadList>>();
    const videoUploadListVm = ref<InstanceType<typeof VideoList>>();
    const fileUploadListVm = ref<InstanceType<typeof FileList>>();
    const colorCardVm = ref<InstanceType<typeof ColorCard>>();
    const materialFormVm = ref<InstanceType<typeof MaterialForm>>();
    const contentVm = ref<HTMLDivElement>();
    const scrollVm = ref<InstanceType<typeof HScroll>>();
    const state = reactive({
      materialDetail: {} as unknown as MaterialDetail,
      navs: [{
        title: '材料类型',
        isActive: true,
      }],
      scrollTop: 0,
      scrollEl: null as HTMLElement | null,
      clickNavTitle: '', // 保存点击时的title,方便点击菜单栏的时候可以选择到未够距离的标签
      fileForm: {
        material: undefined as File | undefined,
        materialEnclosureItem: {
          url: '',
          name: '',
        },
        imgList: [] as UploadItems,
        videoList: [] as UploadItems,
        fileList: [] as UploadItems,
      },
      colorInfos: [] as Colors,
      loading: false,
      loadingText: '',
      isSync: false as Boolean | undefined, //  是否同步到外部市场
    });

    // eslint-disable-next-line max-len
    watch(() => ({ materialFile: state.fileForm.material, materialUrl: state.fileForm.materialEnclosureItem.url }), async ({ materialFile, materialUrl }) => {
      if (!!materialFile !== !!materialUrl) return; // materialFile和materialUrl都是同时修改的,避免多次触发
      try {
        state.loading = true;
        await handle4ddatChage(materialFile, toRef(state, 'colorInfos'));
      } finally {
        state.loading = false;
      }
    });

    const userIds = computed(() => [state.materialDetail.attributeInfo?.creator] || []);
    const userObj = useUsers(userIds);


    const setStatisAndColor = () => {
      const { materialDetail } = state;
      // TODO:imgList需增加云渲染的缩略图
      state.fileForm.imgList = apiEnclosureItems2UploadItems(materialDetail.enclosureInfo.images || []);
      state.fileForm.videoList = apiEnclosureItems2UploadItems(materialDetail.enclosureInfo.videos || []);
      state.fileForm.fileList = apiEnclosureItems2UploadItems(materialDetail.enclosureInfo.docs || []);
      const _colorInfos = [] as Colors;
      materialDetail.renderingInfo.sort((a, b) => a.sort - b.sort).forEach((colorInfoItem, i) => {
        if (i === 0) { // 以第一个为准
          state.fileForm.materialEnclosureItem.url = colorInfoItem?.fileInfo?.['4ddat'] || '';
        }
        const color = {
          ...getDefaultColor(),
          name: colorInfoItem.name,
          temName: colorInfoItem.name,
          value: colorInfoItem.colorInfo,
          isDefault: colorInfoItem.isDefault === 1,
          system: colorInfoItem.colorFamily,
          isBindMaterialFile: colorInfoItem.isBan === 1,
          fileInfo: colorInfoItem.fileInfo,
          imgInfo: colorInfoItem.imgInfo,
          renderingInfo: colorInfoItem.renderingInfo,
          // TODO:后面isUnfindColor的判断需要根据贴图4ddat调整
          isUnfindColor: colorInfoItem.isBan === 1 && colorInfoItem.colorInfo === '',
        };
        _colorInfos.push(color);
      });
      state.colorInfos = _colorInfos;
    };

    const setForm = async () => {
      const categoryList = await api.fetchCategoryList(props.material.categoryId);

      const catergory = {
        big: categoryList[0],
        middle: categoryList[1],
        small: categoryList[2] || {},
      };
      await materialFormVm.value?.reset(catergory);
      state.materialDetail = (await api.fetchMaterial(props.material.catalogId)).data;
    };

    onMounted(async () => {
      await setForm();
      setStatisAndColor();
    });

    const handleClickNav = (i: number, nav: GetArrayItem<typeof state.navs>) => {
      state.navs.forEach((item, _i) => {
        item.isActive = i === _i;
      });
      const selector = `[h-scroll=${nav.title}]`;
      state.scrollEl = contentVm.value?.querySelector(selector) as HTMLElement;
      state.clickNavTitle = nav.title;
    };

    // 获取设置的标题DOM元素
    const getTitleEls = () => {
      return [...(contentVm.value?.querySelectorAll('[h-scroll]') || [])] as HTMLElement[];
    };

    // 获取当前内容是属于哪个catalog
    const getContentCatalog = (scrollTop: number) => {
      const titleEls = getTitleEls();
      if (!titleEls.length) return '';
      const currentTitleEl = titleEls.reverse().find(item => scrollTop >= item.offsetTop);
      if (!currentTitleEl) return '';
      const currentCatalog = currentTitleEl.getAttribute('h-scroll');
      return currentCatalog;
    };

    // 内容滚动同步右侧目录
    const onScroll = (scrollTop: number) => {
      const title = getContentCatalog(scrollTop);
      if (!title) return;
      state.navs.forEach((item, _i) => {
        item.isActive = item.title === title;
      });
    };

    // 滚动结束
    const scrollEnd = (scrollTop: number) => {
      // 使得可以再次触发滚动
      state.scrollEl = null;
      if (state.clickNavTitle) {
        state.navs.forEach((item, _i) => {
          item.isActive = item.title === state.clickNavTitle;
        });
        state.clickNavTitle = '';
      }
    };

    const categoryChange = async () => {
      await nextTick(); // 获取titleEls
      state.navs = getTitleEls().map((title, i) => ({
        title: title.getAttribute('h-scroll') || '', isActive: i === 0,
      }));
    };

    const submit = async () => {
      try {
        const { form2ApiParams } = materialFormVm.value;
        const attributeInfo = await form2ApiParams();

        if (['已上架'].includes(props.material.tag)) {
          try {
            await dialogConfirm({ title: '是否同步到公开市场？' });
            state.isSync = true;
          } catch (err) {
            state.isSync = false;
          }
        }
        state.loading = true;
        const uploadSizeStat = getUploadSizeStat(state.fileForm);
        uploadSizeStat.getTotalSize();

        const uploadOssKeys = await getEnclosureInfo(state.fileForm, (...args) => {
          uploadSizeStat.addUploadedSize(args);
        });
        const renderingInfo = await getRenderingInfo({
          colorInfos: state.colorInfos,
          materialEnclosureItem: state.fileForm.materialEnclosureItem,
          onParseStart: () => {
            state.loadingText = '解析中...';
          },
          onParseEnd: () => {
            state.loadingText = '';
          },
          onUpload: (...args) => {
            uploadSizeStat.addUploadedSize(args);
          },
        });
        const apiParams = {
          catalogId: props.material.catalogId,
          isSync: state.isSync,
          renderingInfo,
          enclosureInfo: uploadOssKeys,
          attributeInfo: {
            ...attributeInfo,
            hasFile: state.fileForm.materialEnclosureItem.url ? 1 : 0,
          },
        };
        await api.editMaterial(apiParams);
        ElMessage.success('上传成功');
        emit('confirm');
        // try {
        //   await dialog({
        //     is: UploadResult,
        //     props: {
        //       failList,
        //       // showButton: false,
        //       successText: '保存成功',
        //       successButtonText: '确定',
        //     },
        //   });
        //   // 成功:重新编辑
        //   emit('confirm');
        // } catch (err) {
        //   if (err instanceof AppError) {
        //     if (err?.isClose) {
        //       // 直接关闭
        //       emit('confirm');
        //     } else {
        //       // 失败:再试一次
        //       await submit();
        //     }
        //   } else {
        //     throw err;
        //   }
        // } finally {
        //   failList.splice(0, failList.length);
        // }
      } finally {
        state.loading = false;
      }
    };

    const cancel = () => {
      emit('cancel');
    };

    const confirm = async () => {
      await submit();
    };


    return {
      ...toRefs(state),
      userObj,
      imgUploadListVm,
      videoUploadListVm,
      fileUploadListVm,
      colorCardVm,
      materialFormVm,
      contentVm,
      scrollVm,
      handleClickNav,
      onScroll,
      scrollEnd,
      categoryChange,
      cancel,
      confirm,
      dayjs,
      validateFiles,
      uploadedPercentage,
    };
  },
});
</script>

<style lang="scss">
.material-edit-dialog {
  .el-dialog__body {
    padding: 0;
  }
}
</style>

<style lang="scss" scoped>
// @import 'url'
.material-edit {
  display: flex;
  .nav {
    width: 160px;
    padding: 30px 0 0 30px;
    flex-shrink: 0;
    background: #fafbfc;
    box-shadow: -1px 0px 0px 0px #dddddd inset;
    .nav-item {
      border-right: 4px solid transparent;
      cursor: pointer;
      line-height: 20px;
      margin-bottom: 20px;
      &:hover {
        color: $color-primary;
      }
      &.is-active {
        color: $color-primary;
        border-color: $color-primary;
      }
    }
  }
  .content {
    flex: 1;
    /deep/ .h-scroll {
      overflow-x: hidden;
      padding: 10px 30px 0 30px;
    }
    .title {
      color: #222222;
      height: 24px;
      line-height: 24px;
      margin: 20px 0;
    }
    /deep/.upload-title {
      margin-top: 6px;
      font-size: 12px;
    }
    .edit-material-file {
      width: 136px;
      height: 136px;
      position: relative;
      &.has-file {
        border: 1px solid #dddddd;
        border-radius: 5px;
        &:hover {
          .default-upload-close-icon {
            opacity: 1;
          }
        }
      }

      .default-upload-close-icon {
        opacity: 0;
      }
    }
    .bottom-tip {
      font-size: 12px;
      color: #999999;
      margin-top: 40px;
      span {
        + span {
          margin-left: 155px;
        }
      }
    }
    .footer {
      text-align: right;
      padding: 40px 30px 30px 0;
    }
  }
}
</style>

