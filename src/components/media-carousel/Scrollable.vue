<template>
  <div class="container">
    <div
      :style="outsideScrollbar && scrollabelClass ? outsideScrollbarStyle : {}"
      :class="scrollabelClass"
      ref="scroll-element"
      @scroll="handleScroll"
    >
      <slot />
    </div>
  </div>
</template>
<script>
import { scrollTo } from '_/scroll';
import getScrollbarWidth from './scrollbar-width.js';

const scrollbarWidth = getScrollbarWidth();

export default {
  mounted() {
    const target = this.$refs['scroll-element'];
    this.updateScrollable({ target });
  },
  computed: {
    scrollabelClass() {
      // eslint-disable-next-line no-nested-ternary
      return `${this.x && this.y ? 'scrollable-xy' : this.x ? 'scrollable-x'
        : this.y ? 'scrollable-y' : ''} ${this.hideScrollbar ? 'hide-scrollbar' : ''} `;
    },
    outsideScrollbarStyle() {
      const styles = {};
      const w = scrollbarWidth + 2;
      if (this.x) {
        styles.bottom = `${-w}px`;
      }
      if (this.y) {
        styles.right = `${-w}px`;
      }
      return styles;
    },
  },
  data() {
    return {
      scrollData: null,
    };
  },
  methods: {
    handleScroll($event) {
      this.updateScrollable($event);
      this.$emit('scroll', $event, this.scrollData);
    },
    updateScrollable({ target }) {
      /** @type {HTMLDivElement} */
      this.scrollData = {
        scrollLeft: target.scrollLeft,
        scrollHeight: target.scrollHeight,
        scrollTop: target.scrollTop,
        scrollWidth: target.scrollWidth,
        clientWidth: target.clientWidth,
        clientHeight: target.clientHeight,
        canScrollUp: target.scrollTop !== 0,
        canScrollDown: target.scrollTop + target.clientHeight
          !== target.scrollHeight,
        canScrollLeft: target.scrollLeft !== 0,
        canScrollRight: target.scrollLeft + target.clientWidth
          !== target.scrollWidth,
      };
    },
    scroll(dir = 1) {
      if (typeof dir === 'number') {
        if (this.x && this.y) {
          dir = [dir, dir];
        } else if (this.x) {
          dir = [dir, 0];
        } else if (this.y) {
          dir = [0, dir];
        }
      }
      const target = this.$refs['scroll-element'];
      scrollTo({
        left: target.scrollLeft + dir[0] * target.clientWidth,
        top: target.scrollTop + dir[1] * target.clientHeight,
      }, target);
    },
    scrollToEnd() {
      const target = this.$refs['scroll-element'];
      const options = {};
      if (this.x) {
        options.left = target.scrollLeft;
      }
      if (this.y) {
        options.top = target.scrollTop;
      }
      scrollTo(options, target);
    },
    scrollToStart() {
      const target = this.$refs['scroll-element'];
      scrollTo({ left: 0, top: 0 }, target);
    },
  },
  props: {
    hideScrollbar: Boolean,
    outsideScrollbar: Boolean,
    y: Boolean,
    x: Boolean,
  },
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  .scrollable-x,
  .scrollable-y,
  .scrollable-xy {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }
  .scrollable-x {
    overflow-x: scroll;
  }
  .scrollable-y {
    overflow-y: scroll;
  }
  .scrollble-xy {
    overflow: scroll;
  }
}
</style>
