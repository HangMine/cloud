import {
  defineComponent, reactive, toRefs, onMounted, Slot, computed, Teleport, Ref, onBeforeUnmount, ref,
} from 'vue';
import {
  materialStatusOptions, colorFamilyOptions,
} from '@/models/Material';
import { options as searchOptions, getOptions } from '@/pages/components/material/components/MaterialForm/utils';
import CategoryCascader from '@/components/form/cascader/CategoryCascader.vue';
import DictionaryAddressItemSelector from '@/components/form/DictionaryAddressItemSelector.vue';
import RangeInput from '@/components/form/RangeInput.vue';
// import deepCopy from '@/utils/deep-copy';
import { FormItem, FormItems, Options } from '../form/HForm/type';
import HForm from '../form/HForm/index.vue';
import './index.scss';
import { resetParams } from '../form/HForm/utils';
import InputWithUnit from './components/InputWithUnit.vue';
import useCollapseChange from './composables/useCollapseChange';
// const initStaticFormData = {
//   keywords: '',
// };
// const initCollapseFormData = {
//   categoryId: [],
//   supplierLocation: '',
//   season: [],
//   year: '',
//   applicableProduct: '',
//   colorFamily: '',
//   isInStock: '',
//   sampleMoqUnit: '码',
//   sampleMoq: '',
//   samplePriceCurrency: '人民币',
//   samplePrice: [],
//   moqUnit: '码',
//   moq: '',
//   priceCurrency: '人民币',
//   price: [],
//   leadTimeUnit: '天',
//   leadTime: [],
//   grammageUnit: '平米克重',
//   grammage: [],
//   thicknessUnit: 'mm',
//   thickness: [],
//   widthUnit: 'cm',
//   width: [],
//   textureType: '',
//   modeOfProduction: '',
//   organizationType: '',
// };

// 单位相关的表单项
const unitFormItemList = [
  'sampleMoqUnit',
  'moqUnit',
  'samplePriceCurrency',
  'priceCurrency',
  'leadTimeUnit',
  'grammageUnit',
  'thicknessUnit',
  'widthUnit',
];

const isEmpty = (val: number | string | null | undefined) => {
  return !val && val !== 0;
};

const CollapseSearchFilter = defineComponent({
  name: 'collapse-search-filter',
  props: {
    form: {
      type: Array as () => FormItems,
    },
    handleChange: {
      type: Function,
      required: true,
    },
    size: {
      type: String,
      default: 'small',
    },
    // 是否公开市场页面
    // isMarketPage: {
    //   type: Boolean,
    //   default: false,
    // },
    // 是否材料管理页面
    isHomePage: {
      type: Boolean,
      default: false,
    },
    isMarketPage: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, slots }) {
    const {
      isCollapsed,
      handleCollapseStatusChange,
    } = useCollapseChange();

    const state = reactive({
      // 表单配置
      formData: [] as FormItems,
      // 静止的表单项配置
      staticFormData: [] as FormItems,
      // 折叠的表单项配置
      collapseFormData: [] as FormItems,
      // 静止的表单参数
      staticFormParams: {} as {[key: string]: any},
      // 折叠的表单参数
      collapseFormParams: {} as {[key: string]: any},

      staticFormSlot: {} as {[key: string]: Slot},
      collapseFormSlot: {} as {[key: string]: Slot},

    });

    const handleCommonChange = () => {
      console.log('collapseFormParams', state.collapseFormParams);
      // 根据后端入参要求格式化并深拷贝搜索条件
      const _collapseFormParams = Object.entries(state.collapseFormParams).reduce((obj: Obj, [key, val]) => {
        if (key === 'categoryId') {
          // const categoryIds = (val as {0: string, 1: string}[]).map(e => e[1]);
          // const categoryId = val?.[2] || val?.[1] || '';
          obj[key] = val ? (val as {0: string, 1: string}[]).map(e => e[1]) : [];
          // state.collapseFormParams.categoryId = categoryId ? [categoryId] : [];
        } else if (['tag', ...unitFormItemList].includes(key)) {
          // 除tag和单位项外, 其他项后端要求为数组
          obj[key] = val;
        } else if (Array.isArray(val)) {
          obj[key] = [...val.filter(e => !isEmpty(e))];
          const _item = obj[key];
          if (_item.length === 2 && _item[0] > _item[1]) {
            // if (isEmpty(_item[0]) || isEmpty(_item[1])) {
            //   isEmpty(_item[0]) && (_item[0] = 0);
            //   isEmpty(_item[1]) && (_item.length = 1); // 如果只有最小值, 则数组改为单一元素
            // } else if (_item[0] > _item[1]) {
            // 前值大于后值时交换位置, 并修改到表单数据中
            obj[key] = [_item[1], _item[0]];
            state.collapseFormParams[key] = [_item[1], _item[0]];
            // }
          }
        } else if (typeof val === 'string' || typeof val === 'number') {
          obj[key] = !isEmpty(val) ? [val] : [];
        }
        return obj;
      }, {});
      const searchParams = { ...state.staticFormParams, ..._collapseFormParams };
      props.handleChange(searchParams);
      isCollapsed.value = true;
    };
    // const handleCascaderChange = (catergorys:string[]) => {
    //   const categoryId = catergorys?.[2] || catergorys?.[1] || '';
    //   state.collapseFormParams.categoryId = categoryId ? [categoryId] : [];
    //   // handleCommonChange();
    // };
    // const handleAddressChange = (val: string) => {
    //   state.collapseFormParams.supplierLocation = val;
      // handleCommonChange();
      // if (type === 'country') {
      //   const cityFormItem = configList.find(data => data.key === 'province');
      //   console.log(cityFormItem, configList);
      //   if (cityFormItem) {
      //     cityFormItem.show = true;
      //   }
      // }
    // };
    const defaultFormItemData: (FormItem | null)[] = [
      {
        key: 'keywords',
        title: '',
        placeholder: '输入关键词',
        prefixIcon: 'el-icon-search',
        onKeyup(e: KeyboardEvent) {
          if (e.key === 'Enter') {
            handleCommonChange();
          }
        },
        // formItemProps: {
        //   style: {
        //     width: '220px',
        //   },
        // },
      },
      {
        key: 'categoryId',
        title: '',
        type: 'cascader',
        collapsed: true,
        placeholder: '全部材料类型',
        // options: [{
        //   key: '',
        //   title: '全部材料类型',
        // }],
        slot: () => (
          <CategoryCascader
            multiple
            collapse-tags
            vModel={state.collapseFormParams.categoryId}
            clearable
          ></CategoryCascader>),
      },
      // 全部材料状态
      !props.isMarketPage ? {
        key: 'tag',
        title: '',
        type: 'select',
        collapsed: true,
        placeholder: '全部材料状态',
        options: materialStatusOptions as Options,
      } : null,
      {
        key: 'applicableProduct',
        title: '',
        type: 'select',
        multiple: true,
        collapsed: true,
        placeholder: '全部适用产品',
        options: getOptions(searchOptions.applicableProduct),
      },
      {
        key: 'colorFamily',
        title: '',
        type: 'select',
        multiple: true,
        collapsed: true,
        placeholder: '全部色系',
        options: colorFamilyOptions as Options,
      },
      {
        key: 'isInStock',
        title: '',
        type: 'select',
        collapsed: true,
        placeholder: '是否现货',
        options: getOptions(searchOptions.isInStock),
      },
      // {
      //   key: 'textureType',
      //   title: '',
      //   type: 'select',
      //   value: '',
      //   collapsed: true,
      //   placeholder: '全部纹理类型',
      //   options: getOptions(searchOptions.textureType),
      // },
      {
        key: 'year',
        title: '',
        type: 'select',
        multiple: true,
        collapsed: true,
        placeholder: '全部年份',
        options: getOptions(searchOptions.yaer),
      },
      {
        key: 'season',
        title: '',
        type: 'select',
        multiple: true,
        collapsed: true,
        placeholder: '全部季节',
        options: getOptions(searchOptions.season),
      },
      {
        key: 'sampleMoq',
        title: '',
        type: 'input',
        collapsed: true,
        slot: () => (
          <div class="flex">
            <InputWithUnit
              vModels={[
                [state.collapseFormParams.sampleMoq],
                [state.collapseFormParams.sampleMoqUnit, 'unit'],
              ]}
              placeholder='样品起订量'
              unitOptions={getOptions(searchOptions.unit)}
            ></InputWithUnit>
          </div>
        ),
      },
      {
        key: 'sampleMoqUnit',
        title: '',
        type: 'span',
        collapsed: true,
        value: '码',
      },
      {
        key: 'moq',
        title: '',
        type: 'input',
        collapsed: true,
        slot: () => (
          <div class="flex">
            <InputWithUnit
              vModels={[
                [state.collapseFormParams.moq],
                [state.collapseFormParams.moqUnit, 'unit'],
              ]}
              placeholder='量产起订量'
              unitOptions={getOptions(searchOptions.unit)}
            ></InputWithUnit>
          </div>
        ),
      },
      {
        key: 'moqUnit',
        title: '',
        type: 'span',
        collapsed: true,
        value: '码',
      },
      {
        key: 'samplePrice',
        title: '',
        type: 'select',
        multiple: true,
        collapsed: true,
        slot: () => (
          <div class="flex">
            <RangeInput
              vModels={[
                [state.collapseFormParams.samplePrice[0], 'fromValue'],
                [state.collapseFormParams.samplePrice[1], 'toValue'],
              ]}
              fromPlaceholder="最低样品价格"
              toPlaceholder="最高样品价格"
            ></RangeInput>
            <el-select class="append-form-item" vModel={state.collapseFormParams.samplePriceCurrency}>
              {getOptions(searchOptions.priceUnit).map(option => (
                <el-option key={option.key} label={option.title} value={option.key}></el-option>
              ))}
            </el-select>
          </div>
        ),
      },
      {
        key: 'samplePriceCurrency',
        title: '',
        type: 'span',
        collapsed: true,
        value: '人民币',
      },
      {
        key: 'price',
        title: '',
        type: 'select',
        multiple: true,
        collapsed: true,
        // formItemProps: {
        //   class: 'prepend-form-item',
        // },
        slot: () => (
          <div class="flex">
            <RangeInput
              vModels={[
                [state.collapseFormParams.price[0], 'fromValue'],
                [state.collapseFormParams.price[1], 'toValue'],
              ]}
              fromPlaceholder="最低大货价格"
              toPlaceholder="最高大货价格"
            ></RangeInput>
            <el-select class="append-form-item" vModel={state.collapseFormParams.priceCurrency}>
              {getOptions(searchOptions.priceUnit).map(option => (
                <el-option key={option.key} label={option.title} value={option.key}></el-option>
              ))}
            </el-select>
          </div>
        ),
      },
      {
        key: 'priceCurrency',
        title: '',
        type: 'span',
        collapsed: true,
        value: '人民币',
      },
      {
        key: 'leadTime',
        title: '',
        type: 'select',
        multiple: true,
        collapsed: true,
        slot: () => (
          <div class="flex">
            <RangeInput
              vModels={[
                [state.collapseFormParams.leadTime[0], 'fromValue'],
                [state.collapseFormParams.leadTime[1], 'toValue'],
              ]}
              fromPlaceholder="最小量产周期"
              toPlaceholder="最大量产周期"
            ></RangeInput>
            <el-select class="append-form-item" vModel={state.collapseFormParams.leadTimeUnit}>
              {getOptions(searchOptions.timeUnit).map(option => (
                <el-option key={option.key} label={option.title} value={option.key}></el-option>
              ))}
            </el-select>
          </div>
        ),
      },
      {
        key: 'leadTimeUnit',
        title: '',
        type: 'span',
        collapsed: true,
        value: '天',
      },
      {
        key: 'grammage',
        title: '',
        type: 'select',
        multiple: true,
        collapsed: true,
        formItemProps: {
          class: 'prepend-form-item',
        },
        slot: () => (
          <div class="flex">
            <RangeInput
              vModels={[
                [state.collapseFormParams.grammage[0], 'fromValue'],
                [state.collapseFormParams.grammage[1], 'toValue'],
              ]}
              fromPlaceholder="最小克重"
              toPlaceholder="最大克重"
            ></RangeInput>
            <el-select class="append-form-item" vModel={state.collapseFormParams.grammageUnit}>
              {getOptions(searchOptions.grammageUnit).map(option => (
                <el-option key={option.key} label={option.title} value={option.key}></el-option>
              ))}
            </el-select>
          </div>
        ),
      },
      {
        key: 'grammageUnit',
        title: '',
        type: 'span',
        collapsed: true,
        value: '平米克重',
      },
      {
        key: 'thickness',
        title: '',
        type: 'select',
        multiple: true,
        collapsed: true,
        formItemProps: {
          class: 'prepend-form-item',
        },
        slot: () => (
          <div class="flex">
            <RangeInput
              vModels={[
                [state.collapseFormParams.thickness[0], 'fromValue'],
                [state.collapseFormParams.thickness[1], 'toValue'],
              ]}
              fromPlaceholder="最小厚度"
              toPlaceholder="最大厚度"
            ></RangeInput>
            <el-select class="append-form-item" vModel={state.collapseFormParams.thicknessUnit}>
              {getOptions(searchOptions.thicknessUnit).map(option => (
                <el-option key={option.key} label={option.title} value={option.key}></el-option>
              ))}
            </el-select>
          </div>

        ),
      },
      {
        key: 'thicknessUnit',
        title: '',
        type: 'span',
        collapsed: true,
        value: 'mm',
      },
      {
        key: 'width',
        title: '',
        type: 'select',
        multiple: true,
        collapsed: true,
        formItemProps: {
          class: 'prepend-form-item',
        },
        slot: () => (
          <div class="flex">
            <RangeInput
              vModels={[
                [state.collapseFormParams.width[0], 'fromValue'],
                [state.collapseFormParams.width[1], 'toValue'],
              ]}
              fromPlaceholder="最小幅宽"
              toPlaceholder="最大幅宽"
            ></RangeInput>
            <el-select class="append-form-item" vModel={state.collapseFormParams.widthUnit}>
              {getOptions(searchOptions.widthUnit).map(option => (
                <el-option key={option.key} label={option.title} value={option.key}></el-option>
              ))}
            </el-select>
          </div>
        ),
      },
      {
        key: 'widthUnit',
        title: '',
        type: 'span',
        collapsed: true,
        value: 'cm',
      },
      // {
      //   key: 'textureType',
      //   title: '',
      //   type: 'select',
      //   collapsed: true,
      //   placeholder: '全部纹理类型',
      //   options: getOptions(searchOptions.textureType),
      // },
      // {
      //   key: 'modeOfProduction',
      //   title: '',
      //   type: 'select',
      //   collapsed: true,
      //   placeholder: '全部生产方式',
      //   options: getOptions(searchOptions.modeOfProduction),
      // },
      // {
      //   key: 'organizationType',
      //   title: '',
      //   type: 'select',
      //   collapsed: true,
      //   placeholder: '全部组织类型',
      //   options: getOptions(searchOptions.organizationType),
      // },
      props.isHomePage ? null : {
        key: 'supplierLocation',
        title: '',
        type: 'select',
        collapsed: true,
        slot: () => (
          <DictionaryAddressItemSelector
            vModel={state.collapseFormParams.supplierLocation}
            parentId="49"
            type="province"
            placeholder="全部供应商所在地"
            clearable
          ></DictionaryAddressItemSelector>),
      },
      props.isHomePage ? {
        key: 'hasFile',
        title: '',
        type: 'select',
        collapsed: true,
        // value: '',
        placeholder: '是否上传4ddat文件',
        options: getOptions([{
          id: 1,
          name: '是',
        }, {
          id: 0,
          name: '否',
        }]),
      } : null,
    ];

    // 处理搜索表单数据
    const setFormData = () => {
      const formItemData = props.form ?? defaultFormItemData;
      formItemData.forEach(item => {
        if (!item) {
          return;
        }
        const _item = {
          // 增加事件处理
          // onChange() {
          //   handleCommonChange();
          // },
          ...item,
        };
        state[item.collapsed !== true ? 'staticFormData' : 'collapseFormData'].push(_item);
        const slot = slots[item.key] ?? item.slot;
        if (slot) {
          state[item.collapsed !== true ? 'staticFormSlot' : 'collapseFormSlot'][item.key] = slot;
        }
      });
    };
    // 是否有正在搜索项
    const isFiltering = computed(() => {
      return Object.entries({ ...state.collapseFormParams })
        .some(([key, val]) => (!unitFormItemList.includes(key) && (Array.isArray(val) ? val.length > 0 : !!val)));
    });

    setFormData();

    const handleReset = () => {
      state.staticFormParams = resetParams(state.staticFormData);
      state.collapseFormParams = resetParams(state.collapseFormData);
      // state.staticFormParams = deepCopy(initStaticFormData);
      // state.collapseFormParams = deepCopy(initCollapseFormData);
    };
    return {
      ...toRefs(state),
      isCollapsed,
      handleCollapseStatusChange,
      handleCommonChange,
      handleReset,
      isFiltering,
    };
  },
  render() {
    console.log(this);
    return (
      <div class="collapse-search-filter">
        <div class="static-form flex">
          <HForm
            data={this.staticFormData}
            vModel={this.staticFormParams}
            inline=""
            size={this.size || 'small'}
            v-slots={this.staticFormSlot}
          >
            {/* {SearchBtn} */}
          </HForm>
          <el-button
            class={['filter-btn', { 'is-filtering': this.isFiltering }]}
            onClick={($event: Event) => this.handleCollapseStatusChange($event)}>
            <i class="iconfont i-r-shaixuan-nor"></i>
            &nbsp;筛选
          </el-button>
        </div>
        {/* <el-collapse-transition> */}
        <div class={['collapse-form', { 'is-open': !this.isCollapsed }]} onClick={($event) => $event.stopPropagation()}>
          <HForm
            data={this.collapseFormData}
            vModel={this.collapseFormParams}
            inline=""
            size={this.size || 'small'}
            v-slots={this.collapseFormSlot}
          >
            {/* {SearchBtn} */}
          </HForm>
          <div class="handler-btns-bar flex-justify-flex-end">
            <el-button onClick={this.handleReset}>重置</el-button>
            <el-button type="primary" onClick={this.handleCommonChange}>确认</el-button>
          </div>
        </div>
        {/* </el-collapse-transition> */}
        {!this.isCollapsed && (<Teleport to="#hTableWrap">
          <div class="table-mask el-loading-mask">
          </div>
        </Teleport>)}
      </div>
    );
  },
});


export default CollapseSearchFilter;
