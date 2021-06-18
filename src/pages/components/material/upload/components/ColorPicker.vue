<template>
  <ul class="material-color-picker">
    <li v-for="color in colors" :key="color.name" :style="{ marginTop: mode === 'tooltip' ? '10px' : 0 }">
      <!-- 根据是否 mode = tooltip, 显示文字状态和文字隐藏状态  -->
      <template v-if="mode === 'tooltip'">
        <el-tooltip effect="light" :content="$t(`material.color.${color.name}`)">
          <i
            class="color-demo"
            :class="{ active: color.active, white: color.name === 'White' }"
            :style="{ backgroundColor: color.heximal }"
            @click="changeActiveStatus(color)"
          />
        </el-tooltip>
      </template>
      <template v-else>
        <i
          class="color-demo"
          :class="{ active: color.active, white: color.name === 'White' }"
          :style="{ backgroundColor: color.heximal }"
          @click="changeActiveStatus(color)"
        />
        <p class="color-name">{{ $t(`material.color.${color.name}`) }}</p>
      </template>
    </li>
  </ul>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, ref, reactive, watch, toRefs, PropType,
} from 'vue';

export const materialColorPicker = [
  {
    name: 'Red', cnName: '红', heximal: '#f00', active: false,
  },
  {
    name: 'Orange', cnName: '橙', heximal: '#FF6300', active: false,
  },
  {
    name: 'Yellow', cnName: '黄', heximal: '#FFE50F', active: false,
  },
  {
    name: 'Green', cnName: '绿', heximal: '#3EED4F', active: false,
  },
  {
    name: 'Blue', cnName: '蓝', heximal: '#2FB9F3', active: false,
  },
  {
    name: 'Purple', cnName: '紫', heximal: '#DE54E8', active: false,
  },
  {
    name: 'Black', cnName: '黑', heximal: '#000', active: false,
  },
  {
    name: 'Gray', cnName: '灰', heximal: '#808080', active: false,
  },
  {
    name: 'White', cnName: '白', heximal: '#fff', active: false,
  },
];

export default defineComponent({
  name: 'MaterialColorPicker',
  props: {
    mode: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const state = reactive({
      colors: materialColorPicker,
      values: [] as typeof props.modelValue,
    });
    watch(() => props.modelValue, (value) => {
      state.colors.forEach(item => {
        item.active = value.includes(item.name);
      });
    }, { immediate: true });
    watch(() => state.colors, () => {
      const value = state.colors.filter(item => item.active).map(item => item.name);
      emit('update:modelValue', value);
    }, { deep: true });


    const changeActiveStatus = (color: GetArrayItem<typeof materialColorPicker>) => {
      color.active = !color.active;
    };

    return {
      ...toRefs(state), changeActiveStatus,
    };
  },
});
</script>

<style lang="scss" scoped>
.material-color-picker {
  display: flex;
  justify-content: space-between;

  .color-demo {
    position: relative;
    display: block;
    width: 18px;
    height: 18px;
    margin: 0 auto;
    border-radius: 50%;
    border: 3px solid #fff;
    cursor: pointer;

    &.white {
      width: 14px;
      height: 14px;
      margin: 2px;
      border: 1px solid #e6e6e6;
    }
    &.active.white {
      width: 18px;
      height: 18px;
      margin: 0;
      border: 3px solid #fff;
    }

    &.active::after {
      content: "";
      position: absolute;
      top: -2px;
      left: -2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid #2979ff;
    }
  }
  .color-name {
    font-size: 12px;
    color: #666;
    line-height: 20px;
    text-align: center;
  }
}
</style>
