<template>
  <section style="position: relative">
    <Scrollable x class="scrollable product-list" ref="product-list" @scroll="updateScrollable">
      <div
        ref="product-item"
        class="item"
        v-for="(item, index) in colorCardList"
        :key="`${item.name}_${index}`"
        :class="{ current: index === current }"
        @click="changeColorCard(item, index)"
      >
        <template v-if="item?.imgInfo?.imgUrl_crease">
          <BaseImage class="color-card-display" fit="cover" :src="item.imgInfo?.imgUrl_crease"> </BaseImage>
        </template>
        <template v-else>
          <div class="color-card-display" :style="{ 'background-color': item.colorInfo || 'none' }"></div>
        </template>
        <div class="color-name text-one-line">{{ item.name }}</div>
      </div>
    </Scrollable>
    <div class="scroll-left scroll-arrow-circle" @click="scrollRow(1, 1)" v-if="canScrollLeft">
      <i class="el-icon-arrow-left" style="font-size: 12px; color: #999999"></i>
    </div>
    <div class="scroll-right scroll-arrow-circle" @click="scrollRow(0, 1)" v-if="canScrollRight">
      <i class="el-icon-arrow-right" style="font-size: 12px; color: #999999"></i>
    </div>
  </section>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
} from 'vue';
import BaseImage from '@/components/base/Image';
import Scrollable from './Scrollable';

export default defineComponent({
  name: 'color-picker',
  components: {
    BaseImage,
    Scrollable,
  },
  props: {
    items: {
      type: Array,
      default: () => ([]),
    },
  },
  emits: ['click-item'],
  setup(props, { attrs }) {
    const state = reactive({
      current: 0,
      canScrollLeft: null,
      canScrollRight: null,
      colorCardList: [],
    });
    return {
      ...toRefs(state),
    };
  },
  mounted() {
    const target = this.$refs['product-list'].$el.children[0];
    setTimeout(() => {
      this.updateScrollable({ target });
    }, 500);
  },
  watch: {
    items: {
      handler(arr) {
        this.colorCardList = [...arr];
        let defaultIndex;
        this.colorCardList.forEach((val, index) => {
          if (val.isDefault === 1) defaultIndex = index;
        });
        if (defaultIndex) {
          const defaultColorCard = this.colorCardList.splice(defaultIndex, 1);
          this.colorCardList = [...defaultColorCard, ...this.colorCardList];
        }
        console.log('this.colorCardList', this.colorCardList);
        const target = this.$refs['product-list']?.$el?.children[0];
        // 等渲染完成，才计算是否显示scorll参数
        if (target) {
          setTimeout(() => {
            this.updateScrollable({ target });
          }, 500);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async scrollRow(dir = 0 /** num = 2* */) {
      // eslint-disable-next-line no-unused-vars
      const target = this.$refs['product-list'].$el.children[0];
      if (!target.scrollTo) {
        if (!dir) {
          target.scrollLeft += target.clientWidth;
        } else {
          target.scrollLeft -= target.clientWidth;
        }
        return;
      }
      if (!dir) {
        target.scrollTo({
          left: target.scrollLeft + target.clientWidth,
          behavior: 'smooth',
        });
      } else {
        target.scrollTo({
          left: target.scrollLeft - target.clientWidth,
          behavior: 'smooth',
        });
      }
    },
    updateScrollable({ target }) {
      if (!target) return;
      this.canScrollLeft = target.scrollLeft !== 0;
      this.canScrollRight = target.scrollLeft + target.clientWidth !== target.scrollWidth;
    },
    changeColorCard(info, index) {
      if (this.current === index) return;
      this.current = index;
      this.$emit('click-item', info);
    },
  },
});

</script>
<style scoped lang="scss">
.product-list {
  height: 50px;
  line-height: 24px;
  white-space: nowrap;
  text-align: center;
  :deep(.scrollable-x::-webkit-scrollbar) {
    display: none;
  }
  :deep(.scrollable-x) {
    scrollbar-width: none;
  }
  :deep(.item) {
    border-radius: 4px;
    border: 1px solid transparent;
    padding: 1px;
    transition: border-color 0.3s;
    width: 50px;
    height: 30px;
    flex: none;
    cursor: pointer;
    display: inline-block;
    margin-right: 10px;
    .el-image {
      display: block;
      border-radius: 0;
    }
    &:hover {
      border-color: #2878ff;
    }
    &.current,
    &:active {
      border-color: #2878ff;
      border-width: 2px;
      padding: 0;
    }
    .color-name {
      font-size: 12px;
      text-align: center;
      color: #222222;
      line-height: 17px;
    }
    .color-card-display {
      width: 100%;
      height: 100%;
    }
  }
}
.scroll-left {
  position: absolute;
  left: -30px;
  top: 23px;
  cursor: pointer;
}
.scroll-right {
  position: absolute;
  right: -22px;
  top: 23px;
  cursor: pointer;
}
.scroll-arrow-circle {
  width: 24px;
  height: 24px;
  border: 1px solid #cccccc;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
