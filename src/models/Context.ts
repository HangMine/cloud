import { AccountType } from '@/api/account';

export class User {
  id!: string;
  name!: string;
  account!: string;
  type!: AccountType;
  companyId!: string;
  companyName!: string;
  headImg!: string;
  // mail!: string;
  // mobile!: string;
  // phone!: string;
  // sourcePlatformId!: string;
  status!: number;
  department!: string;
  constructor(mixin: Partial<User>) {
    Object.assign(this, mixin);
  }
}

export class Company {
  id!: string;
  name!: string;
  businessModel!: string;
  businessScope!: string;
  leadingProduct!: string | string[];
  cooperationBrand!: string;
  landline!: string;
  addressCountry!: string | null;
  addressProvince!: string | null;
  addressCity!: string | null;
  address!: string;
  logo!: string;
  type!: AccountType; // 角色类型
  creatorMail!: string;
  creatorPhone!: string;
  creatorName!: string;
  industry!: string;
  constructor(mixin: Partial<Company>) {
    Object.assign(this, mixin);
  }
}

export class Context {
  // 当前用户
  user!: User;
  _userId!: User['id'];
}
