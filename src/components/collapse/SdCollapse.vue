<template>
  <div class="sd-collapse collapse-text-area" :class="{ expend: !isCollapse }">
    <div ref="contentInner" v-if="isStatic">
      <slot :isCollapse="isCollapse"></slot>
    </div>
    <template v-else>
      <div class="collpase-btn" v-if="$slots['collpase-btn']">
        <slot name="collpase-btn" :handleActiveStatusChange="handleActiveStatusChange"></slot>
      </div>
      <!-- 根据高度折叠 -->
      <div v-if="collapseBy === 'height'" class="content-wrapper" :style="contentWrapperStyle">
        <div ref="contentInner">
          <slot :isCollapse="isCollapse"></slot>
        </div>
      </div>
      <!-- 根据show/if折叠 -->
      <el-collapse-transition v-else>
        <slot :isCollapse="isCollapse"></slot>
      </el-collapse-transition>

      <el-button class="blue btn-bottom" type="text" @click="handleActiveStatusChange" v-if="!$slots['collpase-btn']">
        {{ isCollapse ? expendBtnText : collapseBtnText }}
        <i class="el-icon-arrow-down"></i>
      </el-button>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch, onMounted, PropType, computed, nextTick,
} from 'vue';
import { delay } from '@4dst-saas/public-utils/dist/delay';

export default defineComponent({
  props: {
    collapseBy: {
      type: String as PropType<'visible' | 'height'>,
      default: 'visible',
    },
    minHeight: {
      type: Number,
      default: 0,
    },
    expendBtnText: {
      type: String,
      default: '展开',
    },
    collapseBtnText: {
      type: String,
      default: '收起',
    },
    // 内容高度小于minHeight时是否展示折叠按钮
    minHeightCollapsable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    const pMounted = new Promise((resolve) => {
      onMounted(resolve);
    });
    const isCollapse = ref(props.collapseBy !== 'height');
    const contentInner = ref(null);
    const contentHeight = ref(0);
    const isInited = ref(false); // 是否已初始化

    // 是否在高度小于minHeight时去掉折叠功能
    const isStatic = computed(() => {
      return props.collapseBy === 'height' && !props.minHeightCollapsable && contentHeight.value && contentHeight.value <= props.minHeight;
    });
    if (props.collapseBy === 'height') {
      // 因transition对于height:auto无效, 所以用js获取slot高度
      watch(() => slots, async (val) => {
        await pMounted;
        // 初始化先不折叠,等展开获取到全高后, 再隐藏
        isCollapse.value = true;
        contentHeight.value = Math.floor(contentInner.value?.getBoundingClientRect().height);
        if (!isInited.value) {
          // await nextTick();
          // 获取高度后, 延迟50ms再设为已初始化, 保证初始化进入时不会由过渡展开的效果
          await delay(50);
          isInited.value = true;
        }
      }, { immediate: true });
    }

    const contentWrapperStyle = computed(() => {
      return {
        height: isCollapse.value ? `${props.minHeight}px` : `${contentHeight.value}px`,
        transition: (isInited.value) ? 'height 0.3s' : 'unset',
      };
    });
    return {
      isCollapse,
      contentInner,
      contentHeight,
      contentWrapperStyle,
      isStatic,
      handleActiveStatusChange() {
        isCollapse.value = !isCollapse.value;
      },
    };
  },
});
</script>

<style lang="scss">
.collapse-text-area {
  .content-wrapper {
    overflow: hidden;
    // transition: height 0.3s;
  }
  .el-icon-arrow-down,
  .append-icon-arrow:after {
    transition: transform 0.3s;
  }
  &.expend {
    .el-icon-arrow-down,
    .append-icon-arrow:after {
      transform: rotate(-180deg);
    }
  }
  .collpase-btn {
    cursor: pointer;
  }
  .btn-bottom {
    &:focus,
    &:active,
    &:hover {
      @extend .blue;
    }
  }
  .append-icon-arrow {
    &:after {
      content: "";
      display: inline-block;
      // width: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #666;
    }
  }
}
</style>
