<template>
  <div class="material-form" :class="{ 'is-add': isAdd }">
    <h3 class="title" h-scroll="材料类型">材料类型</h3>
    <MaterialType v-model="category" ref="materialTypeVm"></MaterialType>
    <h3 class="title" h-scroll="基本信息">基本信息</h3>

    <SdCollapse collapseBy="height" :minHeight="220" expendBtnText="展开全部" v-if="isCollapseVisible">
      <template #default>
        <HForm :data="baseFormData" v-model="baseForm" size="small" :ref="handleRef" :gutter="30" :transition="true">
          <template #designContent>
            <InputTag v-model="baseForm.designContent" placeholder="按下enter生成标签"></InputTag>
          </template>

          <template #applicableParts>
            <div class="applicableParts-input-wrap">
              <div class="applicableParts-input">
                <el-popover
                  v-model:visible="showApplicablePartsCascader"
                  popper-class="applicableParts-popover"
                  :append-to-body="popperAppendToBody"
                  width="auto"
                  placement="bottom-start"
                  trigger="click"
                >
                  <template #reference>
                    <i class="add-applicableParts i-r-tianjia-12 hover-link" @click="openApplicablePartsCascader"></i>
                  </template>
                  <el-cascader-panel
                    v-model="baseForm.applicableParts"
                    class="applicableParts-panel"
                    :props="{ multiple: true }"
                    :options="applicablePartsOptions"
                  ></el-cascader-panel>
                </el-popover>
                <div
                  v-for="(item, i) of displayApplicableParts"
                  :key="`${item[0]}-${item[1]}`"
                  class="applicableParts-item"
                >
                  <span class="el-tag el-tag--info el-tag--mini el-tag--light">
                    <span class="el-select__tags-text over-text">{{ getApplicablePartsName(item) }} </span
                    ><i class="el-tag__close el-icon-close" @click="removeApplicablePartsValue(i)"></i>
                  </span>
                </div>

                <span
                  v-if="baseForm.applicableParts.length > 4"
                  class="applicableParts-number el-tag el-tag--info el-tag--mini el-tag--light"
                  @click="showAllApplicablePartsValue = !showAllApplicablePartsValue"
                >
                  <span class="el-select__tags-text over-text">
                    {{ showAllApplicablePartsValue ? "收起" : `+${baseForm.applicableParts.length - 4}` }}
                    <i v-show="showAllApplicablePartsValue" class="i-r-shang-12 del-icon"></i>
                  </span>
                </span>
              </div>
            </div>
          </template>
        </HForm>
      </template>
    </SdCollapse>

    <h3 class="title" h-scroll="业务信息">业务信息</h3>
    <SdCollapse collapseBy="height" :minHeight="144" expendBtnText="展开全部" v-if="isCollapseVisible">
      <template #default>
        <HForm
          :data="businessFormData"
          v-model="businessForm"
          size="small"
          :ref="handleRef"
          :transition="true"
          :gutter="30"
        >
        </HForm>
      </template>
    </SdCollapse>

    <template v-if="featureFormData.length">
      <SdCollapse>
        <template #collpase-btn="{ handleActiveStatusChange }">
          <h3 class="title append-icon-arrow" h-scroll="材料特征属性" @click="handleActiveStatusChange">
            材料特征属性
          </h3>
        </template>
        <template #default="{ isCollapse }">
          <HForm
            v-show="!isCollapse"
            :data="featureFormData"
            v-model="featureForm"
            size="small"
            :ref="handleRef"
            :gutter="30"
          ></HForm>
        </template>
      </SdCollapse>
    </template>

    <template v-if="otherFormData.length">
      <SdCollapse>
        <template #collpase-btn="{ handleActiveStatusChange }">
          <h3 class="title append-icon-arrow" h-scroll="材料其他属性" @click="handleActiveStatusChange">
            材料其他属性
          </h3>
        </template>
        <template #default="{ isCollapse }">
          <HForm
            v-show="!isCollapse"
            :data="otherFormData"
            v-model="otherForm"
            size="small"
            :ref="handleRef"
            class="flex-wrap"
            :gutter="30"
          >
            <template #softness>
              <el-slider
                v-model="otherForm.softness"
                :step="50"
                :show-stops="false"
                :marks="{
                  0: options.other.softness[0].name,
                  50: options.other.softness[1].name,
                  100: options.other.softness[2].name,
                }"
              >
              </el-slider>
            </template>
            <template #airPermeability>
              <el-slider
                v-model="otherForm.airPermeability"
                :step="50"
                :show-stops="false"
                :marks="{
                  0: options.other.airPermeability[0].name,
                  50: options.other.airPermeability[1].name,
                  100: options.other.airPermeability[2].name,
                }"
              >
              </el-slider>
            </template>
            <template #wearResistance>
              <el-slider
                v-model="otherForm.wearResistance"
                :step="50"
                :show-stops="false"
                :marks="{
                  0: options.other.wearResistance[0].name,
                  50: options.other.wearResistance[1].name,
                  100: options.other.wearResistance[2].name,
                }"
              >
              </el-slider>
            </template>
            <template #elasticForce>
              <el-slider
                v-model="otherForm.elasticForce"
                :step="50"
                :show-stops="false"
                :marks="{
                  0: options.other.elasticForce[0].name,
                  50: options.other.elasticForce[1].name,
                  100: options.other.elasticForce[2].name,
                }"
              >
              </el-slider>
            </template>
          </HForm>
        </template>
      </SdCollapse>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, markRaw, toRef, onBeforeUpdate, watch, PropType, Ref, nextTick, onMounted,
} from 'vue';
import Material, { MaterialDetail } from '@/models/Material';
import HForm from '@/components/form/HForm/index.vue';
import InputTag from '@/components/form/InputTag.vue';
import AppError from '@/utils/error';
import SdCollapse from '@/components/collapse/SdCollapse';
import * as materialApi from '@/api/material';

import deepCopy from '@/utils/deep-copy';
import MaterialType from './MaterialType.vue';
import {
  options, useFormData, Category,
} from './utils';

type ApplicablePartsOptions = { value: string, label: string, children?: ApplicablePartsOptions }[];

let allModelObj: Record<string, materialApi.ModelApiItem> = {};
let allModelPartsObj: Record<string, materialApi.Part> = {};


export default defineComponent({
  name: 'material-form',
  components: {
    MaterialType, HForm, InputTag, SdCollapse,
  },
  props: {
    attributeInfo: {
      type: Object as PropType<MaterialDetail['attributeInfo']>,
    },
    isAdd: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['category-change'],
  setup(props, { emit }) {
    const isCollapseVisible = ref<Boolean>(props.visible);
    if (!props.visible) {
      const unwatchVisibleChange = watch(() => props.visible, async (val) => {
        console.log(val);
        if (val) {
          isCollapseVisible.value = val;
          await nextTick();
          unwatchVisibleChange();
        }
      });
    }

    const state = reactive({
      category: {
        big: {},
        middle: {},
      } as unknown as Category,
      baseForm: {},
      businessForm: {},
      featureForm: {},
      physicalForm: {},
      otherForm: {},
      applicablePartsOptions: [] as ApplicablePartsOptions,
      showApplicablePartsCascader: false,
      showAllApplicablePartsValue: false,
    });

    const displayApplicableParts = computed(() => {
      const { applicableParts } = state.baseForm;
      return state.showAllApplicablePartsValue ? applicableParts : applicableParts.slice(0, 4);
    });

    const compAttributeInfo = computed(() => props.attributeInfo);


    const {
      baseFormData, businessFormData, featureFormData, otherFormData,
    } = useFormData(toRef(state, 'category'), compAttributeInfo as unknown as Ref<Obj>);

    const calcCollapsedFormData = (formData, isCollapse) => {
      // console.log(formData.map(item => {
      //   const isHide = isCollapse && !item.keepVisible;
      //   if (!item.formItemProps) {
      //     item.formItemProps = {};
      //   }
      //   item.formItemProps.style = { ...item.formItemProps.style, ...{ display: isHide ? 'none' : 'inline-block' } };
      //   return item;
      // }));
      return formData.map(item => {
        const isHide = isCollapse && !item.keepVisible;
        if (!item.formItemProps) {
          item.formItemProps = {};
        }
        item.formItemProps.style = {
          ...item.formItemProps.style,
          ...{
            display: isHide ? 'none' : 'inline-block',
          },
        };
        return item;
      });
    };
    // const computedBaseFormData = computed(() => {
    //   return calcCollapsedFormData(baseFormData.value);
    // });

    const materialTypeVm = ref<InstanceType<typeof MaterialType>>();
    const hformVms = ref<InstanceType<typeof HForm>[]>([]);
    watch(hformVms, () => {
      emit('category-change'); // 方便外部获取h-scroll
    });
    const handleRef = (hformVm: InstanceType<typeof HForm> | null) => {
      if (hformVm) hformVms.value.push(hformVm);
    };
    // 确保在每次更新之前重置ref
    onBeforeUpdate(() => {
      hformVms.value = [];
    });

    const getApplicablePartsName = (values: [string, string]) => {
      const [modelId, partCode] = values;
      return `${allModelObj[modelId]?.name || ''}/${allModelPartsObj[partCode]?.name || ''}`;
    };

    const validateAllForm = async () => {
      await Promise.all([materialTypeVm.value, ...hformVms.value].map(vm => vm?.validate()));
    };

    const clearValidateAllForm = async () => {
      await Promise.all([materialTypeVm.value, ...hformVms.value].map(vm => vm?.clearValidate()));
    };


    const mergeForm = () => {
      const {
        category, baseForm, businessForm, featureForm, physicalForm, otherForm,
      } = state;
      const getCategoryId = () => category.middle.id;
      return {
        ...compAttributeInfo.value, // 带上接口原先返回的不属于表单的参数
        categoryId: getCategoryId(),
        ...baseForm,
        ...businessForm,
        ...featureForm,
        ...physicalForm,
        ...otherForm,
      };
    };

    const handleParams = (allFormParams: Obj) => {
      Object.entries(allFormParams).forEach(([key, value]) => {
        // 需要处理的特殊值
        switch (key) {
          case 'applicableProduct':
            allFormParams[key] = JSON.stringify(value);
            return;
          case 'sampleMoq':
          case 'moq':
          case 'samplePrice':
          case 'price':
          case 'developmentCycle':
          case 'leadTime':
          case 'physicalSamplePrice':
          case 'physicalSampleLeadTime':
          case 'averageSize':
          case 'grammage':
          case 'thickness':
          case 'width':
          case 'oilContent':
            allFormParams[key] = +value ? ((+value).toFixed(2)) : '';
            return;
          case 'applicableParts':
            {
              const modelPartMap: Record<string, string[]> = {};
              (value || []).forEach((item: [string, string]) => {
                const [modelId, partCode] = item;
                modelPartMap[modelId] = [...(modelPartMap[modelId] || []), partCode];
              });
              const result = Object.entries(modelPartMap).map(([modelId, partCodes]) => {
                const model = deepCopy(allModelObj[modelId]);
                model.modelProp.forEach((_item: any) => {
                  _item.partProp = _item.partProp.filter((__item: materialApi.Part) => partCodes.includes(__item.code));
                });
                return model;
              });
              allFormParams[key] = result;
            }
            break;
          default:
            if (Array.isArray(value)) {
              allFormParams[key] = value.join();
            }
            break;
        }
      });
    };


    // 外部调用
    const form2ApiParams = async () => {
      await validateAllForm();
      const allFormParams = mergeForm();
      handleParams(allFormParams);
      return allFormParams;
    };

    // 外部调用
    const reset = async (category: Category = { big: {}, middle: {} } as Category) => {
      // 编辑
      state.category.big = category.big;
      await nextTick(); // 在big的watch之后触发
      state.category.middle = category.middle;
      await clearValidateAllForm();
    };

    // 设置公模/部位相关数据
    const setApplicablePartsOptions = async () => {
      const publicModelList = (await materialApi.fetchPublicModelList()).data;
      const applicablePartsOptions: ApplicablePartsOptions = [];

      publicModelList.forEach(item => {
        // 存储模型数据
        allModelObj = { ...allModelObj, [item.id]: item };
        const modelFlatParts = item.modelProp.map(_item => _item.partProp || []).flat();
        const modelPartsObj = modelFlatParts.reduce((_partsObj: Record<string, materialApi.Part>, part: materialApi.Part) => {
          _partsObj[part.code] = part;
          return _partsObj;
        }, {} as Record<string, materialApi.Part>);
        // 存储部位数据
        allModelPartsObj = { ...allModelPartsObj, ...modelPartsObj };
        const children = Object.values(modelPartsObj).map(_item => ({ value: _item.code, label: _item.name }));
        const modelItem = {
          value: item.id,
          label: item.name,
          children,
        };
        applicablePartsOptions.push(modelItem);
      });
      state.applicablePartsOptions = applicablePartsOptions;
    };

    const openApplicablePartsCascader = () => {
      state.showApplicablePartsCascader = !state.showApplicablePartsCascader;
    };

    const removeApplicablePartsValue = (i: number) => {
      const newApplicableParts = [...state.baseForm.applicableParts];
      newApplicableParts.splice(i, 1);
      state.baseForm.applicableParts = newApplicableParts;
    };

    onMounted(async () => {
      await setApplicablePartsOptions();
    });


    return {
      ...toRefs(state),
      displayApplicableParts,
      options,
      materialTypeVm,
      handleRef,
      baseFormData,
      businessFormData,
      featureFormData,
      otherFormData,
      form2ApiParams,
      reset,
      isCollapseVisible,
      // computedBaseFormData,
      calcCollapsedFormData,
      openApplicablePartsCascader,
      removeApplicablePartsValue,
      allModelObj,
      allModelPartsObj,
      getApplicablePartsName,
    };
  },
});
</script>
<style lang="scss">
.applicableParts-popover {
  padding: 0 !important;
  .applicableParts-panel {
    border: none !important;
  }
}
.material-form {
  .el-form-item {
    margin-bottom: 16px !important;
  }
  &.is-add {
    max-height: 559px;
    min-height: 359px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .sd-collapse {
    .btn-bottom {
      padding-top: 4px;
    }
  }
  .material-upload-has-unit {
    width: calc(50% - 128px) !important;
    padding-right: 10px !important;
    &.double {
      width: calc(50% - 256px) !important;
      + .el-form-item {
        width: 128px !important;
        padding-right: 10px !important;

        + .el-form-item {
          width: 128px !important;
          .el-form-item__label {
            display: none;
            padding-right: 0;
          }
        }
        .el-form-item__label {
          display: none;
          padding-right: 0;
        }
      }
    }
    + .el-form-item {
      width: 128px !important;
      .el-form-item__label {
        display: none;
        padding-right: 0;
      }
    }
  }
  .el-slider {
    padding: 0 20px 20px;
    // margin-bottom: 20px;
    .el-slider__marks-text {
      white-space: nowrap;
    }
  }
}
</style>
<style lang="scss" scoped>
// @import 'url'
.material-form {
  .title {
    color: #222222;
    height: 24px;
    line-height: 24px;
    margin: 20px 0;
  }
  .el-form-item {
    display: inline-block;
    width: 50%;
    min-height: 65px;
    padding-right: 20px;
    vertical-align: top;

    /deep/ .el-form-item__label {
      float: none;
    }
    /deep/ .el-select {
      width: 100%;
    }
  }
  .form-item-flex {
    /deep/.el-form-item__content {
      display: flex;
    }
    .unit-select {
      width: 128px;
      margin-left: 10px;
    }
  }
  .applicableParts-input-wrap {
    z-index: 1;
    position: relative;
    display: inline-block;
    height: 32px;
    width: 100%;
    vertical-align: top;
    .applicableParts-input {
      background: white;
      position: absolute;
      width: 100%;
      min-height: 32px;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      border: 1px solid #dddddd;
      border-radius: 3px;
      padding: 3px 6px;

      .add-applicableParts {
        flex-shrink: 0;
      }

      .applicableParts-items {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      .applicableParts-item {
        display: inline-block;
        white-space: nowrap;
        margin: 2px 0 2px 6px;
        .el-tag {
          display: flex;
          align-items: center;
          .el-select__tags-text {
            max-width: 80px;
            text-align: center;
          }
          .el-tag__close {
            background-color: #c0c4cc;
            right: -7px;
            top: 0;
            color: #ffffff;
          }
        }
      }
      .applicableParts-number {
        margin-left: 5px;
        flex-shrink: 0;
        cursor: pointer;
        .del-icon {
          font-size: 12px;
          transform: scale(0.8);
          display: inline-block;
        }
      }
    }
  }
}
</style>
