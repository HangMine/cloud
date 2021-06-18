<template>
  <div class="el-loading-mask" v-show="isVisible">
    <div class="el-loading-spinner">
      <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none"></circle>
      </svg>
      <p class="el-loading-text">{{ currentText }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    text: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const currentText = ref(props.text);
    const isVisible = ref(props.visible);

    watch(() => props.text, (val) => {
      currentText.value = val;
    });
    watch(() => props.visible, (val) => {
      isVisible.value = val;
    });

    return {
      currentText,
      isVisible,
    };
  },
});
</script>

