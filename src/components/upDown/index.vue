<template>
  <div class="up-down">
    <div ref="upDownContent" class="content-box">
      <p
        class="content"
        :style="{
          '-webkit-line-clamp': isShow && isDown ? lineSize : '',
        }"
      >
        {{ content }}
      </p>
      <span class="text" v-if="isShow" @click="isDown = !isDown"
        >{{ isDown ? "展开" : "收起" }}
        <i :class="['iconfont', isDown ? 'i-r-xia-12' : 'i-r-shang-12']"></i>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent, nextTick, onMounted, reactive, ref, toRefs, watch,
} from 'vue';

export default defineComponent({
  name: 'up-down',
  components: {},
  props: {
    content: {
      type: String,
      required: true,
    },
    // 默认显示高度
    showHeight: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const upDownContent = ref<HTMLDivElement>();
    const lineSize = ref(0);
    const state = reactive({
      isShow: false,
      isDown: true,
    });
    watch(() => props.content, async () => {
      await nextTick();
      const contentHeight = upDownContent.value!.clientHeight;
      if (props.showHeight && props.showHeight < contentHeight && contentHeight > 21) {
        state.isShow = true;
        lineSize.value = Math.floor(props.showHeight / 20) < 1 ? 1 : Math.floor(props.showHeight / 20); // 一行高度设为20px
      }
    });
    // onMounted(() => {
    //   const contentEle = upDownContent.value;
    //   if (props.showHeight && props.showHeight < contentEle.clientHeight && contentEle.clientHeight > 21) {
    //     state.isShow = true;
    //     lineSize.value = Math.floor(props.showHeight / 20) < 1 ? 1 : Math.floor(props.showHeight / 20); // 一行高度设为20px
    //   }
    // });
    return {
      upDownContent,
      ...toRefs(state),
      lineSize,


    };
  },
});
</script>
<style lang="scss" scoped>
.up-down {
  .content-box {
    position: relative;
    .content {
      overflow: hidden;
      width: 100%;
      padding-right: 40px;
      line-height: 20px;
      color: #666666;
      font-size: 14px;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      white-space: pre-line;
    }
    .text {
      color: $color-primary;
      cursor: pointer;
      position: absolute;
      right: 0;
      bottom: 2px;
      i {
        font-size: 12px;
      }
    }
  }
}
</style>

