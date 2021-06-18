<template>
  <div class="material-share-config" v-loading="loading">
    <div class="main flex">
      <div class="left">
        <ShareContent :materials="materials" :qrcodeDataUrl="qrcodeDataUrl" ref="shareContentVm"></ShareContent>
      </div>
      <div v-if="showConfig" class="right">
        <h4 class="title">分享权限</h4>
        <div>
          <el-radio v-model="type" :label="1">公开</el-radio>
        </div>
        <div>
          <el-radio v-model="type" :label="2">加密</el-radio>
          <el-input v-if="type === 2" v-model="code" size="small" disabled class="share-pw"></el-input>
        </div>
        <h4 class="title">有效期</h4>
        <el-select size="small" v-model="validityType">
          <el-option v-for="item in validityTypeOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
        <h4 class="title">
          <span> 更新状态 </span>
          <IconTip placement="bottom" :size="12">
            <template #content>
              实时更新 ：被分享者可查看资源最新状态<br />不更新 ：被分享者只能看到此刻分享的状态
            </template>
          </IconTip>
        </h4>
        <div>
          <el-radio v-model="isSync" :label="1">实时更新</el-radio>
        </div>
        <div>
          <el-radio v-model="isSync" :label="0">不更新</el-radio>
        </div>
        <!-- <h4 class="title">
          <span> 被分享权限 </span>
          <IconTip
            placement="bottom"
            :size="12"
          >
            <template #content>
              允许被分享 ：被分享者可分享给其他人<br />不允许：被分享者不允许分享给其他人
            </template>
          </IconTip>
        </h4>
        <div>
          <el-radio v-model="isAgain" :label="1">允许被分享</el-radio>
        </div> -->
        <!-- <div>
          <el-radio v-model="isAgain" :label="0">不允许</el-radio>
        </div> -->
        <h4 class="title">分享对象</h4>
        <el-select size="small" multiple v-model="shareObject">
          <el-option v-for="item in shareObjectOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
        <h4 class="title">分享介绍</h4>
        <el-input v-model="subject" type="textarea" :rows="3" :maxlength="200" show-word-limit></el-input>
      </div>
    </div>
    <div class="footer">
      <el-button :disabled="!isLoadedEnd" @click="downImg">下载图片</el-button>
      <el-button :disabled="!isLoadedEnd" @click="copyImg">复制图片</el-button>
      <el-button type="primary" @click="copyLink">分享</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { MaterialDetail, MaterialList } from '@/models/Material';
import {
  defineComponent, reactive, computed, ref, toRefs, markRaw, PropType, onUnmounted, nextTick, onMounted,
} from 'vue';
import * as shareApi from '@/api/share';
import { copy } from '@/components/sd-table/utils';
import { ElMessage } from 'element-plus';
import dom2image from 'dom-to-image';
import { download } from '@/utils/util';
import env from '@/utils/envs';
import { ShareLinkParams, getShareObj, shareOptions } from '@/api/share';
import IconTip from '@/components/tip/IconTip.vue';
import { getMiniProgramQrCodeData } from '@/api/material';
import AppError from '@/utils/error';
import ShareContent from './ShareContent/index.vue';
import { isLoadedEnd } from './ShareContent/utils';


const validityTypeOptions = [{
  key: 1,
  label: '永久',
}, {
  key: 2,
  label: '一天',
}, {
  key: 3,
  label: '一周',
}, {
  key: 4,
  label: '一个月',
}];

const createRandomString = () => {
  const upEnArr = [...new Array(26)].map((_, i) => 65 + i);
  const downEnArr = [...new Array(26)].map((_, i) => 97 + i);
  const numArr = [...new Array(10)].map((_, i) => 48 + i);
  const arr = [...upEnArr, ...downEnArr, ...numArr];
  const randomIndexArr = [...new Array(4)].map(() => String.fromCharCode(arr[Math.round(Math.random() * (arr.length - 1))]));
  return randomIndexArr.join('');
};

export default defineComponent({
  name: 'material-share-config',
  dialogify: {
    props: {
      width: '440px',
      title: '分享',
      customClass: 'share-config-dialog',
    },
  },
  components: { ShareContent, IconTip },
  props: {
    materials: {
      type: Array as PropType<MaterialList>,
      required: true,
    },
    showConfig: {
      type: Boolean,
      default: false,
    },
    shareInfo: {
      type: Object as PropType<AsyncReturnType<typeof shareApi.fetchShareConfig>['data']>,
    },
  },
  setup(props, { emit }) {
    const shareContentVm = ref<InstanceType<typeof ShareContent>>();
    const state = reactive({
      type: 1,
      validityType: 1,
      code: createRandomString(),
      isSync: 1,
      isAgain: 1,
      subject: '',
      shareObject: [],
      shareObjectOptions: [] as shareOptions,
    } as ShareLinkParams);
    const loading = ref(false);
    const qrcodeDataUrl = ref('');
    const getImgUrl = async () => {
      const dataUrl = await dom2image.toPng(shareContentVm.value?.$el);
      return dataUrl;
    };

    const getQrcodeImage = async (shareId: string) => {
      qrcodeDataUrl.value = await getMiniProgramQrCodeData('pages/share/share-check', shareId, 280);
    };
    const getShareData = async () => {
      const { shareInfo } = props;
      if (!props.showConfig && !shareInfo) {
        throw AppError.abort;
      }
      const params = props.showConfig ? {
        ...state,
        shareObject: state.shareObject.join(','),
        catalogIds: props.materials.map(item => item.catalogId),
        code: state.type === 2 ? state.code : undefined,
      } : {
        shareObject: state.shareObject.join(','),

        ...shareInfo,
        catalogIds: props.materials.map(item => item.catalogId),
      };
      const { data: { shareId, code } } = await shareApi.createShareLink(params);
      return { shareId, code };
    };

    const downImg = async () => {
      try {
        loading.value = true;
        const { shareId } = await getShareData();
        await getQrcodeImage(shareId);
        await nextTick();
        const imgUrl = await getImgUrl();
        const imgName = props.materials.slice(0, 3).map(item => item.name).join();
        download(imgUrl, imgName);
      } finally {
        loading.value = false;
      }
    };

    const copyImg = async () => {
      try {
        loading.value = true;
        const { shareId } = await getShareData();
        await getQrcodeImage(shareId);
        await nextTick();
        const imgBlob = await dom2image.toBlob(shareContentVm.value?.$el);
        const result = await navigator.permissions.query({ name: 'clipboard-write' });
        console.log('copyImgResult', result);
        if (result.state === 'granted') {
          // @ts-ignore
          await navigator.clipboard.write([
            // @ts-ignore
            new window.ClipboardItem({
              [imgBlob.type]: imgBlob,
            }),
          ]);
          ElMessage.success('复制成功');
        } else if (result.state === 'denied') {
          throw new Error('复制失败:没有剪切版的权限');
        }
      } catch (error) {
        console.log(error);
        ElMessage.error('复制失败:浏览器版本过低或没有剪切版的权限');
      } finally {
        loading.value = false;
      }
    };


    const copyLink = async () => {
      try {
        loading.value = true;
        // if (props.showConfig) {
        //   const params = {
        //     ...state,
        //     catalogIds: props.materials.map(item => item.catalogId),
        //     code: state.type === 2 ? state.code : undefined,
        //   };
        //   const { data: { shareId, code } } = await shareApi.createShareLink(params);
        //   const copyStr = `分享链接：${window.location.host}/share?shareId=${shareId}${code ? `\n访问密码：${code}` : ''}`;
        //   copy(copyStr);
        // } else {
        //   // TODO: 暂时的二次分享逻辑
        //   const { shareInfo } = props;
        //   if (!shareInfo) return;
        //   const params = {
        //     ...shareInfo,
        //     catalogIds: props.materials.map(item => item.catalogId),
        //   };
        //   const { data: { shareId, code } } = await shareApi.createShareLink(params);
        //   const copyStr = `分享链接：${window.location.host}/share?shareId=${shareId}${code ? `\n访问密码：${code}` : ''}`;
        //   copy(copyStr);
        // }
        if (state.shareObject.length > 0) {
          await getShareData();
          ElMessage.success('分享成功');
        } else {
          const { shareId, code } = await getShareData();
          const copyStr = `分享链接：${window.location.host}/share?shareId=${shareId}${code ? `\n访问密码：${code}` : ''}`;
          copy(copyStr);
          ElMessage.success('分享链接复制成功');
        }
      } finally {
        state.code = createRandomString();
        loading.value = false;
      }
    };
    onMounted(async () => {
      const res = await getShareObj();
      res.map((item: Obj) => {
        state.shareObjectOptions.push({ key: item.userId, label: item.userName });
        return state.shareObjectOptions;
      });
    });

    return {
      ...toRefs(state), isLoadedEnd, loading, shareContentVm, validityTypeOptions, downImg, copyImg, copyLink, qrcodeDataUrl,
    };
  },
});
</script>
<style lang="scss" scoped>
.share-config-dialog {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
<style lang="scss" scoped>
// @import 'url'
.material-share-config {
  .main {
    justify-content: center;
    overflow: hidden;
    .left {
      width: 375px;
      flex-shrink: 0;
      margin-bottom: -90px;
      .share-frame {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      flex: 1;
      padding: 40px 30px 20px 30px;
      height: 577px;
      overflow-y: scroll;

      .title {
        display: flex;
        align-items: center;
        margin: 20px 0 10px 0;
        > span {
          margin-right: 4px;
        }
      }
      /deep/ .el-radio {
        margin: 5px 0;
      }
      .share-pw {
        width: 60px;
        padding-left: 5px;
        /deep/ .el-input__inner {
          padding: 0 10px;
        }
      }
    }
  }
  .footer {
    text-align: right;
    height: 82px;
    line-height: 82px;
    padding-right: 30px;
  }
}
</style>
