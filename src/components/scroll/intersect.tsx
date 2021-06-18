import {
  defineComponent, onMounted, PropType, nextTick, ref,
} from 'vue';


export default defineComponent({
  name: 'intersect',
  props: {
    threshold: {
      type: Array as PropType<number[]>,
      default: () => [0, 0.2],
    },
    root: {
      type: HTMLElement,
      default: () => null,
    },
    rootMargin: {
      type: String,
      default: () => '0px 0px 0px 0px',
    },
  },
  emits: ['destroyed', 'enter', 'change', 'leave'],
  setup(props, { emit, slots }) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) {
        emit('leave', [entries[0]]);
      } else {
        emit('enter', [entries[0]]);
      }

      emit('change', [entries[0]]);
    }, {
      threshold: props.threshold,
      root: props.root,
      rootMargin: props.rootMargin,
    });
    const wrapper = ref<Element>();
    onMounted(async () => {
      // const slot = slots?.default?.();
      await nextTick();
      // if (!slot || slot.length < 1) {
      //   console.warn('[VueIntersect] You must have one child inside a <intersect> component.');
      //   return;
      // }
      // slot!.filter(node => node.el).forEach(node => {
      //   node.el && observer.observe(node.el);
      // });
      wrapper.value && observer.observe(wrapper.value);
    });
    return {
      wrapper,
    };
  },
  render() {
    const slot = this.$slots?.default?.() || null;
    return (
      <div class="wrapper" ref="wrapper">
        {slot}
      </div>
    );
  },
});
