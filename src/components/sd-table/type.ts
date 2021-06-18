import { ElTableColumn } from 'element-plus';

export type Obj = {
  [key in string | number]: any;
};

export interface Column extends Partial<typeof ElTableColumn> {
  key: string,
  title: string,
  minWid?: number,
  calcWid?: any,
  addWid?: number,
  fixWid?: number,
  children?: Columns,
}

export type Columns = Column[];
