<template>
  <div class="upload-result" :class="{ 'is-fail': isFail }">
    <img class="result-icon" :src="require(`@/assets/img/public/${isFail ? 'fail' : 'success'}.png`)" />
    <h3 class="result-title">{{ isFail ? failText : successText }}</h3>
    <div class="footer">
      <el-button v-if="showButton" class="footer-btn" @click="reUpload">{{
        isFail ? failButtonText : successButtonText
      }}</el-button>
      <p v-if="isFail" class="text-link" @click="showFailList">查看失败列表</p>
    </div>
  </div>
</template>

<script lang="ts">
import { dialog } from '@/utils/vue/dialog';
import {
  defineComponent, reactive, computed, ref, toRefs, PropType,
} from 'vue';
import {
  FailUploadList,
} from '@/components/form/upload/utils';
import FailList from './FailList.vue';

export default defineComponent({
  name: 'upload-result',
  dialogify: {
    noTitle: true,
    props: {
      width: '240px',
    },

  },
  components: {},
  props: {
    failList: {
      type: Array as PropType<FailUploadList>,
      default: () => [],
    },
    showButton: {
      type: Boolean,
      default: true,
    },
    successText: {
      type: String,
      default: '上传成功',
    },
    failText: {
      type: String,
      default: '上传失败',
    },
    successButtonText: {
      type: String,
      default: '继续上传',
    },
    failButtonText: {
      type: String,
      default: '再试一次',
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const state = reactive({});
    const isFail = computed(() => {
      return props.failList.length > 0;
    });
    const reUpload = () => {
      emit(isFail.value ? 'cancel' : 'confirm', { failList: props.failList, isFail });
    };
    const showFailList = async () => {
      await dialog({
        is: FailList,
        props: {
          failList: props.failList,
        },
      });
    };
    return {
      ...toRefs(state), isFail, reUpload, showFailList,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.upload-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .result-icon {
    width: 60px;
    margin-top: 30px;
  }
  .result-title {
    margin-top: 20px;
  }
  .footer {
    margin-bottom: 30px;
    .footer-btn {
      margin-top: 40px;
    }
  }
  &.is-fail {
    .text-link {
      font-size: 12px;
      margin-top: 10px;
      text-align: center;
    }
  }
}
</style>
