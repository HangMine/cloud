<template>
  <div>{{ text }}</div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import i18n from './i18n';

export default defineComponent({
  name: 'h-empty',
  props: {},
  setup(props, { emit }) {
    const state = reactive({
      text: i18n.t('empty'),
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss">
// @import 'url'
.h-empty {
  height: 512px;
}
</style>
