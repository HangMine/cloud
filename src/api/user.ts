/* eslint-disable import/prefer-default-export */
import { User } from '@/models/Context';
import axios from '@/utils/axios';
import tokenUtils from '@/utils/token';
import { fetchUserInfo, fetchUserCompany, fetchUserAuditStatus } from '@/api/account';

export async function getUserInfo(): Promise<User> {
  const [user, { type, name }, status] = await Promise.all([
    fetchUserInfo(), fetchUserCompany(), fetchUserAuditStatus(),
  ]);
  // statue枚举值：1=待补充，2=已补充待提交，3=已提交待审核，4=已审核
  return {
    ...user, type, companyName: name, ...{ status },
  };
}
