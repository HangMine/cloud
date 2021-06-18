<template>
  <div class="detail-form-field">
    <label class="label text-one-line">{{ label }}</label>
    <div class="content-box text-one-line">
      <template v-if="content">
        <span class="content text-one-line" v-if="content">
          {{ content }}
        </span>
      </template>
      <template v-else>
        <span class="gray-text">--</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Unit {
  type: string,
  value: number | string,
}

export default defineComponent({
  name: 'MaterialFormFieldText',
  components: {},
  props: {
    // 标签名称
    label: {
      type: String,
      required: true,
    },
    // 内容
    content: {
      type: [String, Number],
      default: '',
    },
    // 单位数组
    units: {
      type: Array as () => Unit[],
      default: () => [],
    },
  },
  setup(props) {
    return {
    };
  },
});
</script>

<style lang="scss" scoped>
.detail-form-field {
  .label {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #666666;
    display: block;
  }
  .content-box,
  .placeholder {
    min-height: 22px;
    font-size: 14px;
    line-height: 23px;
    color: #222222;
    .content {
      vertical-align: middle;
      padding-right: 10px;
    }
    .gray-text {
      color: #999;
    }
  }
  .placeholder {
    color: #999;
  }
}
</style>
