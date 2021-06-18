<template>
  <div>
    <component
      v-for="material in materials"
      :key="material.id"
      :style="styles.item"
      :is="layout"
      :size="size"
      :ellipsis="ellipsis"
      :material="material"
      :ref="handleRef"
      :fontSize="fontSize"
    />
  </div>
</template>
<script lang="ts">
import {
  defineComponent, getCurrentInstance, onMounted, ref, ComponentPublicInstance,
} from 'vue';
import injectStyle from '@/utils/inject-style';
import useRefs from '@/utils/uses/use-refs';

const styles = {
  item: { 'page-break-inside': 'avoid', 'page-break-after': 'always' },
};
const globalStyle = `
  body, html {
    padding: 0;
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
  @page {
    margin: 0
  }
`;
export default defineComponent({
  props: {
    materials: {
      type: Array as () => Obj[],
      required: true,
    },
    layout: {
      type: [Function, Object] as unknown as () => ComponentPublicInstance,
    },
    size: {
      type: Object as () => { width: string, height: string },
    },
    ellipsis: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: Number,
    },
  },
  setup(props) {
    const { vms: vmItems, handleRef } = useRefs<ComponentPublicInstance>();
    const pMounted = new Promise((resolve) => {
      onMounted(resolve);
    });
    const vm = getCurrentInstance()?.proxy;
    return {
      handleRef,
      styles,
      async ready() {
        await pMounted;
        const doc = vm._document ?? vm.$el.ownerDocument;
        injectStyle(doc, globalStyle);
        if (props.size) {
          injectStyle(doc, `@media print { width: ${props.size.width}mm; height: ${props.size.height}mm;}`);
        }
        await Promise.all(vmItems.value.map(item => item.ready()));
      },
      vmItems,
    };
  },
});

</script>
