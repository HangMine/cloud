<template>
  <div class="mobile-materil-preview">
    <MaterialViewer></MaterialViewer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import MaterialViewer from '@/mobile/components/material/viewer/index.vue';

export default defineComponent({
  name: 'materil-preview',
  components: { MaterialViewer },
  props: {},
  setup(props, { emit }) {
    const state = reactive({});
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.mobile-materil-preview {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
