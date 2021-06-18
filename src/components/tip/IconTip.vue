<template>
  <el-tooltip :content="content" placement="bottom-end" effect="light" v-bind="$attrs">
    <i class="icon-tip i-r-gantanhao-12" :style="computedIconStyle"></i>
    <template #content>
      <slot name="content"></slot>
    </template>
  </el-tooltip>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import { getPx } from '../sd-table/utils';

export default defineComponent({
  name: 'icon-tip',
  inheritAttrs: false,
  components: {},
  props: {
    content: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: 18,
    },
    iconStyle: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const computedIconStyle = computed(() => ({
      fontSize: getPx(props.size),
      ...props.iconStyle,
    }));
    return {
      computedIconStyle,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.icon-tip {
  font-size: 18px;
  color: #ccc;
  cursor: pointer;

  &:hover {
    color: $color-primary !important;
  }
}
</style>
