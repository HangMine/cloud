

<script lang="tsx">
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable indent */
import deepCopy from '@/utils/deep-copy';
import AppError from '@/utils/error';
import { ElForm } from 'element-plus';
import {
  defineComponent, reactive, computed, toRefs, getCurrentInstance, watch, onMounted, ref, nextTick,
} from 'vue';
import {
  FormItem, FormItems, Obj, Options,
} from './type';

import { resetParams } from './utils';

export * from './utils';

export default defineComponent({
  name: 'h-form',
  inheritAttrs: false,
  props: {
    data: {
      type: Array as () => FormItems,
      default: () => [],
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    cols: {
      type: [Number, String],
    },
    gutter: {
      type: Number,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    formItemProps: {
      type: Object,
      default: () => ({}),
    },
    labelPosition: {
      type: String,
      default: 'top',
      validator: (value: string) => ['top', 'left'].includes(value),
    },
    showInlineTitle: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, {
    emit, attrs,
  }) {
    const formVm = ref<InstanceType<typeof ElForm>>();
    const unColsInline = attrs.inline === '' && !props.cols;
    const _gutter = unColsInline ? undefined : `${props.gutter ?? 20}px`;
    const currentCols = computed(() => (props.cols && +props.cols) || 2);
    const state = reactive({
      currentData: [] as FormItems,
      params: {} as Obj,
      formItemStyle: computed(() => {
        if (unColsInline) {
          // 如果是inline并且没有传递列数，不需设置宽度
          return {};
        }
        const width = `${+(100 / currentCols.value).toFixed(1)}%`;

        return {
          width,
          paddingRight: _gutter,
        };
      }),
      // 根据间隔修改h-form的marginRight,隐藏最右边宽度
      formStyle: computed(() => {
        return {
          marginRight: `-${props.gutter ?? 20}px`,
        };
      }),
    });

    watch(() => props.modelValue, (val, oldVal) => {
      // if (JSON.stringify(val) === JSON.stringify(oldVal)) return;
      state.params = val;
    }, { immediate: true, deep: true });

    watch(() => state.params, (val, oldVal) => {
      // if (JSON.stringify(val) === JSON.stringify(oldVal)) return;
      emit('update:modelValue', val);
    }, {
      deep: true,
    });

    const isUndefined = (val: any) => val === undefined;

    const setDefaultAttrs = (item: FormItem) => {
      // 默认是input类型
      if (!item.type) item.type = 'input';
      // 设置rule
      if (item.rules) {
        item.rules = item.rules.map((_rule: any) => (_rule.required ? { message: '不能为空', ..._rule } : _rule));
      }
      // 根据类型设置
      switch (item.type) {
        case 'input':
        default:
          // item.placeholder = isUndefined(item.placeholder) ? `请输入${item.title}` : item.placeholder;
          item.clearable = item.clearable === undefined ? true : item.clearable;
          break;
        case 'select':
          // item.placeholder = isUndefined(item.placeholder) ? `请选择${item.title}` : item.placeholder;
          item.clearable = item.clearable === undefined ? true : item.clearable;
          item.filterable = item.filterable === undefined ? true : item.filterable;
          item.options = item.options || [];
          // 对下拉框设置ref，因为iview有BUG，可搜索时，选中后重新打开下拉列表只剩上次选中的值
          item.ref = `select-${item.key}`;
          break;
        case 'checkbox':
        case 'radio':
          item.options = item.options || [];
          break;
        case 'date':
          {
            const isRange = item.childType?.includes('range');
            const singlePlaceholder = { placeholder: isUndefined(item.placeholder) ? `请选择${item.title}` : item.placeholder };
            const rangePlaceholder = {
              startPlaceholder: isUndefined(item.startPlaceholder) ? '开始时间' : item.startPlaceholder,
              endPlaceholder: isUndefined(item.endPlaceholder) ? '结束时间' : item.endPlaceholder,
            };
            const timePlaceholder = isRange ? rangePlaceholder : singlePlaceholder;
            item.childType = item.childType || 'date';
            // elementUI支持时间对象转换成字符串的功能，无需手动转换
            item.valueFormat = item.valueFormat || 'timestamp';
            item = { ...item, ...timePlaceholder };
            break;
          }
        case 'block':
        case 'span':
          {
            item.formItemProps = item.formItemProps || {};
            const _class = item.formItemProps?.class || '';
            const defaultClass = 'empty-item';
            // 暂时不想支持数组的class
            item.formItemProps.class = typeof _class === 'string' ? `${_class} ${defaultClass}` : { ..._class, [defaultClass]: true };
            break;
          }
      }
      return item;
    };

    const setColsStyle = (item: FormItem) => {
      let style = {};
      if (item.col && props.cols) {
        // 如果是inline并且没有传递列数，才需设置宽度
        const width = `${+(100 / currentCols.value).toFixed(1) * +item.col}%`;
        style = {
          width,
          paddingRight: _gutter,
        };
      }
      return { ...item, style: { ...style, ...item.style } };
    };

    const setOptions = (item: FormItem) => {
      const { type, optionsUrl } = item;
      if (!['select', 'checkbox', 'radio'].includes(type!)) return item;
      if (!optionsUrl) return item;
      return item;
    };

    const chainHanlder = (_data: FormItem, fns: Function[] = []) => {
      return fns.reduce((memo, cur) => cur(memo), _data);
    };

    // 对传进来的data进行处理
    const handleData = () => {
      state.currentData = props.data.filter(item => item.show !== false).map(item => {
        const handlers = [setDefaultAttrs, setColsStyle, setOptions];
        return chainHanlder(item, handlers);
      });
    };

    // 根据传进来的数据，生成双向绑定的初始对象
    const _resetParams = () => {
      state.params = resetParams(state.currentData);
    };

    // 验证--用于外部调用
    const validate = async () => {
      await formVm.value?.validate().catch((error) => {
        // console.log(1, error);
        // 会抛出弹出来的错误,在这里处理成不弹出来
        throw AppError.abort;
      });
    };

    // 清除验证--用于外部调用
    const clearValidate = async () => {
      // 必须使用nextTick保证在弹窗出现后执行
      await nextTick();
      formVm.value?.clearValidate();
    };

    watch(() => props.data, (val, oldVal) => {
      handleData();
      _resetParams();
    }, {
      immediate: true,
    });

    // onMounted(() => {
    //   handleData();
    //   _resetParams();
    // });

    return {
      ...toRefs(state),
      formVm,
      setDefaultAttrs,
      setColsStyle,
      setOptions,
      handleData,
      validate,
      clearValidate,
    };
  },
  render() {
    const {
      $attrs, currentData, params, formItemStyle, formStyle, $slots, formItemProps: publicFormItemProps, labelPosition, showInlineTitle,
    } = this;
    const getFormItem = (itemOptions: FormItem) => {
      // 这里没用到的不能剔除，因为需要把它们从otherProps里面剔除
      const {
        key,
        type,
        childType,
        options = [],
        title,
        rules,
        formItemProps,
        value, // 重要!!不能去除,因为现在attrs会覆盖前面的
        // on,
        // nativeOn,
        ...otherProps
      } = itemOptions;
      const itemSlot = $slots[key];
      if (itemSlot) return itemSlot(itemOptions);

      const dynamicProps = { ...otherProps };

      const getOptions = () => options.map(({ key: optionKey, title: optionTitle, ...optionProps }) => {
        const optionAttrs = {
          key: optionKey,
          ...optionProps,
        };
        switch (type) {
          case 'select':
          default:
            return <el-option label={optionTitle} value={optionKey} {...optionAttrs}></el-option>;
          case 'checkbox':
            return (
              <el-checkbox label={optionKey} {...optionAttrs}>
                {optionTitle}
              </el-checkbox>
            );
          case 'radio':
            return (
              <el-radio label={optionKey} {...optionAttrs}>
                {optionTitle}
              </el-radio>
            );
        }
      });

      switch (type) {
        case 'input':
        default:
          return <el-input vModel={params[key]} type={childType} {...dynamicProps}></el-input>;
        case 'select':
          return (
            <el-select vModel={params[key]} {...dynamicProps}>
              {getOptions()}
            </el-select>
          );
        case 'checkbox':
          return (
            <el-checkbox-group vModel={params[key]} {...dynamicProps}>
              {getOptions()}
            </el-checkbox-group>
          );
        case 'radio':
          return (
            <el-radio-group vModel={params[key]} {...dynamicProps}>
              {getOptions()}
            </el-radio-group>
          );
        case 'date':
          return <el-date-picker vModel={params[key]} type={childType} {...dynamicProps}></el-date-picker>;
        case 'time':
          return <el-time-picker vModel={params[key]} {...dynamicProps}></el-time-picker>;
        case 'switch':
          return <el-switch vModel={params[key]} {...dynamicProps}></el-switch>;
        case 'cascader':
          {
            type CascaderOption = {
              value: string | number,
              label: string,
              children?: CascaderOption[]
            };
            const getCascaderOptions = (_options: Options) => {
              return _options.map(option => {
                const newOption: CascaderOption = { value: option.key, label: option.title };
                if (option.children) {
                  newOption.children = getCascaderOptions(option.children);
                }
                return newOption;
              });
            };
            return <el-cascader vModel={params[key]} options={getCascaderOptions(options)} {...dynamicProps}></el-cascader>;
          }
        case 'block':
        case 'span':
          return '';
      }
    };

    return (
      <el-form
        label-width={$attrs.inline === '' && !showInlineTitle ? '0' : $attrs['label-width'] || '80'}
        size={$attrs.size || 'small'}
        class="h-form"
        style={formStyle}
        labelPosition={labelPosition}
        {...$attrs}
        model={params}
        onSubmit={(e: Event) => { e.preventDefault(); }}
        ref="formVm"
      >
        {currentData.filter(item => item.type !== 'span').map(itemOptions => {
          const {
            key, title, rules, formItemProps = {},
          } = itemOptions;
          const { class: formItemClass, style: _formItemStyle, ...otherFormItemProps } = formItemProps;
          return (
            <el-form-item
              key={key}
              prop={key}
              label={$attrs.inline === '' && !showInlineTitle ? '' : title}
              rules={rules}
              class={['h-form-item', formItemClass]}
              style={{ ...formItemStyle, ..._formItemStyle }}
              {...{ attrs: { ...otherFormItemProps, ...publicFormItemProps } }}

            >
              {getFormItem(itemOptions)}
            </el-form-item>
          );
        })}
        {$slots.default?.() || null}


      </el-form>
    );
  },
});

</script>
<style lang="scss">
/* @import 'url'; */
.h-form {
  &.el-form--label-top {
    .el-form-item {
      &.is-required:not(.is-no-asterisk) > .el-form-item__label {
        &:before {
          vertical-align: middle;
        }
      }
      .el-form-item__label {
        padding-bottom: 4px;
        line-height: 20px;
      }
    }
  }
  .h-form-item {
    display: inline-block;
    // 修改elementUI的样式

    // &.label-top {
    //   // title放到上面
    //   .el-form-item__label {
    //     float: none;
    //     line-height: 20px;
    //   }
    // }

    &.empty-item {
      display: block;
      margin: 0;
      height: 0;
    }

    .el-form-item__content {
      // 下拉、单选、多选
      > .el-select,
      .el-radio-group,
      .el-checkbox-group {
        width: 100%;
      }
      // 时间(定为140px，为了不留空白)
      > .el-date-editor.el-input {
        width: 140px;
      }
      // 时间范围
      > .el-range-editor.el-input__inner {
        width: 100%;
        min-width: 230px;
      }
      // 级联
      > .el-cascader {
        width: 100%;
      }
    }
  }
}
</style>
