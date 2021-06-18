<template>
  <h-modal class="h-edit-modal" v-model="show" :form="form" v-model:params="formParams" :submit-url="submitUrl"></h-modal>
</template>

<script>
import HModal from './HModal.vue';

export default {
  name: 'edit-modal',
  components: { HModal },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Array,
      default: () => [],
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    submitUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      show: false,
      formParams: {},
    };
  },
  watch: {
    value: {
      handler(val) {
        this.show = val;
      },
      immediate: true,
    },
    show(val) {
      this.$emit('input', val);
    },
    formParams: {
      handler(val) {
        this.$emit('update:params', val);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss">
/* @import 'url'; */
</style>
