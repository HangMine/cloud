

import {
  defineComponent, reactive, computed, ref, toRefs, PropType,
} from 'vue';

export type CascaderNode = {
  value: string, label: string, level:number, leaf?: boolean
};
export type CascaderNodes = CascaderNode[];


export default defineComponent({
  name: 'sd-cascader',
  inheritAttrs: false,
  components: {},
  props: {
    fetchFn: {
      type: Function as PropType<(node: CascaderNode) => Promise<CascaderNodes>>,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  // emits: ['change'],
  setup(props, { emit, attrs }) {
    const state = reactive({
      nodes: [],
      props: {
        lazy: true,
        multiple: props.multiple,
        lazyLoad: async (node: CascaderNode, resolve: Function) => {
          const fetchNodes = await props.fetchFn(node);
          resolve(fetchNodes);
        },
      },
    });
    return () => (
      <el-cascader props={state.props} {...attrs}></el-cascader>
    );
  },
});

