
<template>
  <div v-if="visible" class="model-rendering-progress"  :class="{ 'is-mobile':isMobile }">
    <div class="progress-info">
      <span>{{ parseInt(info.loaded / info.total * 100, 10) }}%</span>
      <span>{{ `${info.loaded}/${info.total}` }}</span>
    </div>
    <p class="loading-component-name text-one-line">{{ info.current || '' }}</p>
  </div>
</template>

<script>
export default {
  name: 'ModelRenderingProgress',
  props: {
    info: {
      type: Object,
      required: true,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['complished'],
  data() {
    return {
      visible: false,
    };
  },
  watch: {
    info: {
      handler(info) {
        this.visible = true;
        if (info.total === info.succeeded) {
          this.visible = false;
          this.$emit('complished');
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-progress__text) {
  color: #fff;
}

.model-rendering-progress {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 6px;
  padding: 25px;
  width: 460px;
  height: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  margin: auto auto;
  color: #fff;
  &.is-mobile {
    width: 80vw;
  }
  .progress-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .loading-component-name {
    opacity: 0;
    margin-top: 6px;
  }
}
</style>
