<template>
  <div class="material-type">
    <el-form :model="categoryForm" size="small" class="material-type-form" ref="formVm">
      <el-form-item prop="big" label="一级分类" class="is-required" :rules="requiredRule">
        <el-select v-model="categoryForm.big" value-key="id" clearable>
          <el-option v-for="item of options.big" :key="item.id" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="middle" label="二级分类" class="is-required" :rules="requiredRule">
        <el-select v-model="categoryForm.middle" value-key="id" clearable>
          <el-option v-for="item of options.middle" :key="item.id" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, PropType, nextTick, onMounted,
} from 'vue';
import isFilled from '@/utils/validators/valid-filled';
import validator2ElemRule from '@/utils/validators/utils/validator-to-elem-rule';
import { fetchChildCategory, Category as ApiCategory } from '@/api/material';
import { ElForm, ElSelect } from 'element-plus';
import AppError from '@/utils/error';
import { Category } from './utils';

export const requiredRule = validator2ElemRule(isFilled);

type CategoryItem = GetArrayItem<ApiCategory>;

export default defineComponent({
  name: 'material-type',
  props: {
    modelValue: {
      type: Object as PropType<Category>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const smallSelectVm = ref<InstanceType<typeof ElSelect>>();
    const formVm = ref<InstanceType<typeof ElForm>>();
    const state = reactive({
      options: {
        big: [] as ApiCategory,
        middle: [] as ApiCategory,
      },
      categoryForm: {
        big: {},
        middle: {},
      } as typeof props.modelValue,
    });
    watch(() => props.modelValue, (value) => {
      state.categoryForm = value;
    }, { immediate: true, deep: true });
    watch(() => state.categoryForm, (value) => {
      emit('update:modelValue', value);
    }, { deep: true });
    // 大类
    watch(() => state.categoryForm.big, async (value) => {
      if (state.categoryForm.middle.id) state.categoryForm.middle = {} as CategoryItem;
      setTimeout(() => {
        // 先这样解决
        formVm.value?.clearValidate('middle');
      }, 0);
      if (!(value && value?.id)) {
        state.options.middle = [];
        return;
      }

      state.options.middle = (await fetchChildCategory({ pId: value.id })).data;
    });
    // 中类
    watch(() => state.categoryForm.middle, async (value) => {
      setTimeout(() => {
        // 先这样解决
        formVm.value?.clearValidate('small');
      }, 0);
      nextTick().then(() => {
        formVm.value?.clearValidate();
      });
    });


    // 外部调用,跟HForm保持一致的名字
    const validate = async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await formVm.value?.validate().catch(() => { throw AppError.abort; });
    };
    // 外部调用,跟HForm保持一致的名字
    const clearValidate = async () => {
      await formVm.value?.clearValidate();
    };

    onMounted(async () => {
      state.options.big = (await fetchChildCategory({ pId: '-1' })).data;
    });
    return {
      ...toRefs(state), formVm, smallSelectVm, requiredRule, validate, clearValidate,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.material-type {
  overflow: hidden;
  .material-type-form {
    margin-right: -30px;
  }
  .el-form-item {
    display: inline-block;
    width: 50%;
    min-height: 65px;
    padding-right: 30px;

    /deep/ .el-form-item__label {
      float: none;
    }
    /deep/ .el-select {
      width: 100%;
    }
  }
}
</style>
