<template>
  <div class="flexible-error">
    <div class="flexible-error-wraper">
        <component :is="component" v-bind="$props" />
    </div>

  </div>
</template>
<style>
.flexible-error-wraper {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  max-height: 900px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.flexible-error {
  flex: 1;
  position: relative;
}
</style>
<script>
import BlockError from './BlockError.vue';

export default {
  props: {
    error: {},
    buttons: {},
    img: {},
  },

  data() {
    return {
      component: null,
    };
  },
  mounted() {
    this.component = BlockError;
  },
};
</script>
