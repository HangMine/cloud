<template>
  <el-dialog v-model="visible" :title="$t('upload.tagsExample')" width="550px">
    <figure>
      <!-- 展示图片 -->
      <div class="img-box">
        <el-image :src="imgUrl" fit="cover" />
      </div>

      <!-- 标签列表 -->
      <figcaption>
        <ul class="tag-list">
          <li v-for="(tag, i) in tags" :key="i" class="tag-item">{{ tag }}</li>
        </ul>
      </figcaption>
    </figure>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  props: {
    // 图片的url
    imgUrl: {
      type: String,
      required: true,
    },
    // 标签数组，用于对图片的描述
    tags: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const state = reactive({
      visible: false,
    });
    const open = () => {
      state.visible = true;
    };
    const close = () => {
      state.visible = false;
    };
    return { ...toRefs(state), open, close };
  },
});
</script>

<style lang="scss" scoped>
.img-box {
  margin-bottom: 25px;
  text-align: center;
}
.tag-list {
  display: flex;
  justify-content: center;

  .tag-item {
    padding: 5px 20px;
    margin-right: 30px;
    color: $color-primary;
    border: 1px solid $color-primary;
    border-radius: 15px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
