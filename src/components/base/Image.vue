<template>
  <div class="el-image">
    <slot></slot>
    <slot v-if="!src" name="placeholder">
      <div class="img-default" :style="computedDefaultStyle"></div>
    </slot>
    <template v-else-if="loading">
      <slot name="loading" v-if="$slots.loading" />
      <slot name="placeholder" v-else-if="$slots.placeholder" />
      <div v-else class="img-loading" :style="{ 'background-color': defalutLoadingBackground }"></div>
    </template>
    <slot v-else-if="thumb_ === null" name="error">
      <div class="img-error">
        <i class="iconfont icon-img-load-error"></i>
      </div>
    </slot>
    <img
      v-else
      :draggable="false"
      class="el-image__inner"
      v-bind="$attrs"
      :data-thumb="thumbType"
      :data-src="src"
      @click="clickHandler"
      :src="thumb_"
      :style="imageStyle"
      :class="{ 'el-image__inner--center': alignCenter }"
    />
  </div>
</template>

<script lang="ts">
// import { defineComponent } from '@vue/composition-api';
import { defineComponent } from 'vue';
import 'intersection-observer';
import { signUrl, isOssUrl, isNeedSignOssUrl } from '@/utils/oss/utils';
import loadImage from '_/load-image';
import envs from '@/utils/envs';
import filterThumb from '@/filters/thumb';

const dpr = window.devicePixelRatio ?? 1;

const useStyle = false;

const styles = [
  { size: 64, style: 'xs' },
  { size: 128, style: 's' },
  { size: 256, style: 'm' },
  { size: 512, style: 'l' },
  { size: 1024, style: 'xl' },
];

const observeVm = new WeakMap();
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      const vm = observeVm.get(entry.target);
      vm.entry = true;
    }
  });
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
});

const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined;
const ObjectFit = {
  NONE: 'none',
  CONTAIN: 'contain',
  COVER: 'cover',
  FILL: 'fill',
  SCALE_DOWN: 'scale-down',
};
export default defineComponent({
  name: 'base-image',
  inheritAttrs: false,
  props: {
    imgClass: String,
    url: {
      default: () => function url() {
        return this.src;
      },
    },
    src: String,
    fit: {
      type: String,
      default: 'cover',
    },
    lazy: {
      type: Boolean,
      default: true,
    },
    defaultImage: {
      type: String,
      default: require('@/assets/img/public/default-image.png'),
    },
    defaultImageStyle: {
      type: Object,
      default: () => ({}),
    },
    defalutLoadingBackground: {
      type: String,
      default: '#f7f7f7',
    },
    makeThumb: {
      // 制作缩略图
      default: () => async (src, options) => {
        let thumbOptions = { ...options, mode: options.fit === 'scale-down' ? 'fit' : options.fit };
        if (useStyle) { // 使用预设缩略图规格
          const size = Math.max(options.width, options.height);
          const matchStyle = styles.find(item => item.size > size) ?? styles[styles.length - 1];
          thumbOptions = { style: `${matchStyle.style}_${options.mode}` };
        }
        ['width', 'height'].forEach((key) => {
          if (typeof thumbOptions[key] === 'number') {
            thumbOptions[key] = parseInt(thumbOptions[key] * dpr, 10);
          }
        });
        // 返回配置处理后的oss/管道路径
        let result = (!options.width || !options.height) ? src : filterThumb(src, thumbOptions);
        if (!isOssUrl(src)) {
          return result;
        }
        if (envs.VUE_APP_OSS_SIGN && isNeedSignOssUrl(result)) {
          result = await signUrl(result);
        }
        return result;
      },

    },
    thumb: {
      default: true,
    },
  },
  emits: ['error', 'click'],
  data() {
    return {
      entry: false,
      pThumb_: undefined,
      thumb_: undefined,
      url_: undefined,
      loading: false,
      imageWidth: 0,
      imageHeight: 0,
    };
  },
  computed: {
    thumbType() {
      return typeof this.thumb_;
    },
    /** @return {any} */
    imageStyle() {
      const { fit } = this;
      if (fit) {
        return isSupportObjectFit()
          ? { 'object-fit': fit }
          : this.getImageStyle(fit);
      }
      return {};
    },
    /** @return {any} */
    alignCenter() {
      return !isSupportObjectFit() && this.fit !== ObjectFit.FILL;
    },
    computedDefaultStyle() {
      return { backgroundImage: `url('${this.defaultImage}')`, ...this.defaultImageStyle };
    },
  },
  mounted() {
    this.$watch('lazy', (lazy) => {
      if (lazy) {
        this.addLazyLoadListener();
      } else {
        this.entry = true;
      }
    }, {
      immediate: true,
    });
    this.$watch(() => ({ src: this.src, entry: this.entry }), async ({ src, entry }) => {
      if (src && entry) {
        this.loadImage();
      }
    }, {
      immediate: true,
    });
  },
  beforeUnmount() {
    if (this.lazy) {
      this.removeLazyLoadListener();
    }
  },
  methods: {
    // 获取容器长宽，制作缩略图url
    getThumb() {
      let { thumb } = this;
      if (typeof thumb === 'string') { return thumb; }
      if (thumb === true) {
        const {
          clientWidth: containerWidth,
          clientHeight: containerHeight,
        } = this.$el;
        thumb = {
          width: containerWidth,
          height: containerHeight,
          fit: this.fit,
        };
      }

      return this.makeThumb(this.src, thumb);
    },
    async loadImage() {
      // reset status
      this.thumb_ = undefined;
      try {
        this.loading = true;
        const thumb = await this.getThumb();
        const img = await loadImage(thumb);
        this.loading = false;
        this.imageWidth = img.width;
        this.imageHeight = img.height;
        this.thumb_ = thumb;
      } catch (e) {
        this.thumb_ = null;
        console.error(e);
        this.$emit('error', e);
      }
    },
    handleLazyLoad() {
      this.show = true;
    },
    addLazyLoadListener() {
      if (!observeVm.has(this.$el)) {
        observeVm.set(this.$el, this);
        io.observe(this.$el);
      }
    },
    removeLazyLoadListener() {
      if (observeVm.has(this.$el)) {
        io.unobserve(this.$el);
        observeVm.delete(this.$el);
      }
    },
    /**
     * simulate object-fit behavior to compatible with IE11
     * and other browsers which not support object-fit
     */
    getImageStyle(fit) {
      const { imageWidth, imageHeight } = this;
      const {
        clientWidth: containerWidth,
        clientHeight: containerHeight,
      } = this.$el;
      if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return {};
      const vertical = imageWidth / imageHeight < 1;
      if (fit === ObjectFit.SCALE_DOWN) {
        const isSmaller = imageWidth < containerWidth && imageHeight < containerHeight;
        fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN;
      }
      switch (fit) {
        case ObjectFit.NONE:
          return { width: 'auto', height: 'auto' };
        case ObjectFit.CONTAIN:
          return vertical ? { width: 'auto' } : { height: 'auto' };
        case ObjectFit.COVER:
          return vertical ? { height: 'auto' } : { width: 'auto' };
        default:
          return {};
      }
    },
    clickHandler() {
      this.$emit('click');
    },
  },
});
</script>
<style lang="scss" scoped>
.el-image {
  width: 100%;
  height: 100%;
  color: #909399;
  border-radius: 6px;
}
.img-default {
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
}

.img-default,
.img-error,
.img-loading {
  font-size: 150%;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: inherit;
  i {
    font-size: inherit;
  }
}
</style>
