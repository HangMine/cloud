<template>
  <UploadList
    v-model="videoList"
    class="video-list"
    :options="{ types: ['mp4'] }"
    :validOptions="['video']"
    v-bind="$attrs"
    ref="uploadListVm"
  >
    <template #default="{ item }">
      <Video :src="item.url"></Video>
    </template>
    <template #append="{ i, item }">
      <slot name="append" :i="i" :item="item"></slot>
    </template>
  </UploadList>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import Video from '@/components/video/index.vue';
import UploadList from './UploadList.vue';

export default defineComponent({
  name: 'video-list',
  inheritAttrs: false,
  components: { UploadList, Video },
  props: {},
  setup(props, { emit }) {
    const uploadListVm = ref<InstanceType<typeof UploadList>>();
    const state = reactive({
      videoList: [] as File[],
    });
    return {
      ...toRefs(state), uploadListVm,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.video-list {
}
</style>
