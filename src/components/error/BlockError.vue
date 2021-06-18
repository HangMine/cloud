<template>
  <div class="host block-error"
    :class="[align, size]"
    style="margin-top: 50px; margin-bottom: 50px;">
    <div class="background" :style="{backgroundImage: `url('${img_}')`}" />
    <div class="content" v-if="$slots.default">
      <slot></slot>
    </div>
    <div class="content" v-else>
      <h2 v-if="error.title">{{error.code}} {{error.title}}</h2>
      <div class="desc" v-html="lf2br(getMessage(error))"></div>
      <div class="btn-menu" v-if="buttons_.length">
        <el-button round size="small" v-for="(item, index) in buttons_"
          :key="index" :type="item.type"
          @click="() => item.handler.call(vm)">
          {{item.label}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  getMessage, isEmptyError, isAuthError, parseError, logError, ErrorLike,
} from '@/utils/error-handler';
import AppError from '@/utils/error';
import { lf2br } from '../../filters';

function error2Image(error: ErrorLike) {
  if (isEmptyError(error)) {
    return require('@/assets/img/error/empty.png');
  }
  if (isAuthError(error)) {
    return require('@/assets/img/error/no-auth.png');
  }
  return require('@/assets/img/error/network.png');
}

type ButtonConfig = {
  type: '' | 'primary' | 'danger',
  handler: Function,
  label: string
};

export default {
  methods: {
    lf2br,
    getMessage,
  },
  computed: {
    vm() {
      return this;
    },
    buttons_(): ButtonConfig[] {
      return this.buttons ?? [];
    },
    img_(): string {
      return this.img ?? error2Image(this.error);
    },
    error_() {
      return parseError(this.error);
    },
  },
  watch: {
    error_: {
      handler(e) {
        if (e.feCodeError) {
          logError(e);
        }
      },
      immediate: true,
    },
  },
  props: {
    align: {
      default: 'vertical',
    },
    error: {
      type: undefined as unknown as () => ErrorLike,
      default() {
        return AppError.unknown;
      },
    },
    size: {
      default: '',
    },
    img: {
      type: String,
    },
    buttons: {
      type: Array as () => ButtonConfig[],
    },
  },
};
</script>

<style lang="scss" scoped>
.host.block-error {
  margin-top: 0.7142em;
  margin-bottom: 0.7142em;
}

.btn-menu {
  margin-top: 2em;
  height: 32px;
}

h2 {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 1.143em;
  line-height: 1.5;
  color: #222;
  font-weight: 500;
}

h1 {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 1.3em;
  line-height: 1.5;
  color: #434e59;
}

.desc {
  font-size: 1.143em;
  line-height: 1.5;
}

h2 + .desc {
  font-size: 1em;
  line-height: 1;
  margin-top: 0.7143em;
  color: #666;
}

.host {
  display: flex;
}

.background {
  flex: 1;
  width: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  margin: 0;
  min-height: 13.57143em;
  min-width: 13.57143em;
}

.content {
  color: #000;
  text-align: center;
  // large
}

small {
  display: block;
  margin-top: 16px;
  word-wrap: normal;
  word-break: break-all;
}

.vertical {
  flex-direction: column;
  align-items: center;
  .content {
    margin-top: 0.7143em;
  }
}

.horizontal {
  flex-direction: row-reverse;

  .content {
    margin-right: 1.4em;
  }
}

.large {
  .content {
    flex: 1;
  }

  h2 {
    font-size: 2em;
  }

  h1 {
    font-size: 6em;
  }

  .background {
    flex: 2;
  }
}
</style>
