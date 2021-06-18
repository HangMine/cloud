<template>
  <div class="flex preview-detail-container">
    <MediaCarousel v-bind="$attrs" withColorPicker :material="material" :catalogId="catalogId" :autoplay="false"></MediaCarousel>

    <div class="material-detail-text scrollable-y">
      <h2 class="section-title">
        {{ material.attributeInfo.name }}
      </h2>
      <!-- 主要信息 -->
      <div class="section-title-pre">基础信息</div>
      <ul class="field-list" style="margin-top: 20px">
        <li class="field-item">
          <FromFieldText :label="`材质类型`" :content="materialTypeContent" />
        </li>
        <li v-for="field in fields" :key="field.prop" class="field-item">
          <FromFieldText :label="field.label" :content="field.content" :units="field.units" />
        </li>
      </ul>
      <div class="divide-line"></div>
      <!-- 附件文档信息 -->
      <template v-if="uploadDocs?.length">
        <div class="section-title-pre doc-list-titile">附件文档</div>
        <ul class="doc-list">
          <li v-for="docInfo in uploadDocs" :key="docInfo.name" class="doc-item">
            <div class="doc-list-icon">
              <base-image :src="type2Img(docInfo.name)" fit="contain"></base-image>
            </div>
            <span class="doc-item-name text-one-line">{{ docInfo.name }}</span>
            <i class="i-r-xiazai-16 doc-item-download" @click="downloadByURL(docInfo.url, docInfo.name)"></i>
          </li>
        </ul>
      </template>
      <time-info
        :creator="material?.attributeInfo?.creator || ''"
        :uploaded="material?.attributeInfo?.gmtCreateTime || ''"
        :updated="material?.attributeInfo?.gmtModifyTime || material?.attributeInfo?.gmtCreateTime || ''"
        style="margin-top: 20px"
      />
    </div>
  </div>
</template>

<script lang="ts">
import getExt from '_/get-ext';
import { downloadByURL } from '@/utils/util';
import tryParseJson from '@4dst-saas/public-utils/dist/try-parse-json';
import BaseImage from '@/components/base/Image.vue';
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
} from 'vue';
import MediaCarousel from '@/components/media-carousel/index.vue';
import FromFieldText from './FromFieldText.vue';
import TimeInfo from './TimeInfo.vue';

export default defineComponent({
  name: 'MaterialDetailText',
  components: {
    MediaCarousel,
    FromFieldText,
    TimeInfo,
    BaseImage,
  },
  props: {
    material: {
      type: Object,
      required: true,
    },
    materialTypeContent: {
      type: String,
    },
    catalogId: {
      type: String,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      carousel: null,
      fields: [],
      uploadDocs: [],
    });

    console.log('props.material', props.material);

    // const parseApplicableProduct = (value?:string[][]) => {
    //   if (!value) return '--';
    //   return value.map(strArr => strArr.join('/')).join();
    // };

    const parseApplicableProduct = (value?: string[]) => {
      if (!value) return '--';
      return value.join();
    };

    watch(() => props.material, (val, oldVal) => {
      state.fields = [
        {
          label: '供应商货号',
          content: val.attributeInfo?.sn,
        },
        {
          label: '年份',
          content: val.attributeInfo?.year,
        },
        {
          label: '季度',
          content: val.attributeInfo?.season,
        },
        {
          label: '系列',
          content: val.attributeInfo?.series,
        },
        {
          label: '适用产品',
          content: parseApplicableProduct(tryParseJson(val.attributeInfo?.applicableProduct)),
        },
        {
          label: '印刷纹路和图案',
          content: val.attributeInfo?.designContent,
          show: props.materialTypeContent,
        },
      ] as any;
      state.fields = state.fields.filter((item: any) => (item.show === undefined || item.show));
      state.uploadDocs = val?.enclosureInfo?.docs || [];
    }, { deep: true, immediate: true });

    const type2Img = (file: File) => {
      switch (getExt(file)) {
        case 'pdf':
          return require('@/assets/img/file/pdf.png');
        case 'doc':
        case 'docx':
          return require('@/assets/img/file/word.png');
        case 'xls':
        case 'xlsx':
          return require('@/assets/img/file/xlsx.png');
        case 'ppt':
        case 'pptx':
          return require('@/assets/img/file/pptx.png');
        default:
          return require('@/assets/img/file/ohter.png');
      }
    };

    return {
      ...toRefs(state),
      type2Img,
      downloadByURL,
    };
  },
});
</script>

<style lang="scss" scoped>
.preview-detail-container {
  height: 700px;
  border-radius: 4px;
  overflow: hidden;
}
.material-detail-text {
  margin-top: 40px;
  width: 300px;
  background: #ffffff;
  .section-title {
    font-size: 20px;
    color: #333;
    padding: 0 23px 0 30px;
  }
  .section-title-pre {
    font-size: 16px;
    color: #222222;
    padding: 30px 0px 0 30px;
    &.doc-list-titile {
      padding: 16px 0px 4px 30px;
    }
  }
  .doc-list {
    margin: 0 30px 0 30px;
    line-height: 32px;
    .doc-item {
      display: flex;
      align-items: center;
      padding: 12px 0 12px 0;
      font-size: 12px;
      color: #666666;
      border-bottom: 1px solid #dddddd;
      position: relative;
      &:last-child {
        border-bottom: none;
      }
      .doc-item-download {
        font-size: 16px;
        position: absolute;
        right: 0;
        cursor: pointer;
      }
      .doc-list-icon {
        width: 32px;
        height: 32px;
        padding: 3px 4px;
        border: 1px solid #dddddd;
        border-radius: 5px;
        margin-right: 4px;
        .el-image {
          border-radius: 0;
        }
      }
    }
    .doc-item-name {
      padding-right: 20px;
    }
  }
}
.divide-line {
  width: 240px;
  height: 1px;
  background: #dddddd;
  margin-left: 30px;
}
.field-list {
  padding: 0 23px 0 30px;
  display: flex;
  flex-wrap: wrap;
  .field-item {
    width: 100%;
    padding-right: 10px;
    margin-bottom: 20px;
    &.full {
      width: 100%;
    }
  }
  .form-field-notes {
    .content-box,
    .content {
      white-space: initial;
      text-overflow: initial;
      overflow: initial;
    }
  }
}
</style>
