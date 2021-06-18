import { Context, User } from '@/models/Context';
import { modelOf } from '@/utils/model-of';

const UserOrm = modelOf(User, {
  primaryKey: 'id',
  entity: 'User',
  fields() {
    return {
      id: this.attr(undefined),
      name: this.attr(undefined),
      account: this.attr(undefined),
      companyId: this.attr(undefined),
      companyName: this.attr(undefined), // 从companyInfo接口获取
      type: this.attr(undefined), // 从companyInfo接口获取
      headImg: this.attr(undefined),
      department: this.attr(undefined),
      status: this.attr(undefined), // 账号审核状态
    };
  },
});

const ContextOrm = modelOf(Context, {
  primaryKey: 'id',
  entity: 'Context',
  fields() {
    return {
      _userId: this.attr(undefined),
      id: this.attr(undefined),
      user: this.belongsTo(UserOrm, '_userId'),
    };
  },
});


export {
  ContextOrm as Context,
  UserOrm as User,
};
