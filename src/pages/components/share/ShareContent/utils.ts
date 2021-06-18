/* eslint-disable import/prefer-default-export */
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, onMounted, watch,
} from 'vue';

// 分享内容里的资源是否已经加载完成
export const isLoadedEnd = ref(false);
