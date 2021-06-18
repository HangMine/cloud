import { ElFormItem } from 'element-plus';

export type Obj = {
  [key in string | number]: any;
};

export interface Option {
  key: string | number,
  title: string,
  [otherKey: string]: any
}

export type Options = Option[];

export type FormItemProps = Partial<typeof ElFormItem> & { class?: Obj | string, style?: Obj };

export interface FormItem {
  key: string | number,
  title: string,
  type?: 'input' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'switch' | 'cascader' | 'block' | 'span',
  value?: any,
  childType?: string,
  options?: Options,
  optionsUrl?: string,
  rules?: typeof ElFormItem['rules'],
  formItemProps?: FormItemProps,
  show?: boolean,
  collapsed?: boolean, // 是否折叠
  [otherKeys: string]: any,
  multiple?:boolean
}

export type FormItems = FormItem[];

