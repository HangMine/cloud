<template>
  <div class="form-submit-buttons">
    <el-button :size="size" round :style="btnStyle" @click="$emit('cancel')" class="button-cancel">{{
      cancelText ?? $t("public.dialog.cancel")
    }}</el-button>
    <el-button :size="size" :style="btnStyle" round type="primary" @click="$emit('submit')">{{
      submitText ?? $t("public.dialog.save")
    }}</el-button>
  </div>
</template>

<script>
import i18n from 'i18next';

export default {
  name: 'FormSubmitButtons',
  props: {
    size: {
      type: String,
      default: '',
    },
    btnStyle: {
      type: Object,
      default: () => ({}),
    },
    cancelText: {
      type: String,
    },
    submitText: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.form-submit-buttons {
  text-align: right;

  .el-button {
    width: 90px;
  }
  // .button-cancel {
  //   border: none;
  // }
}
</style>
