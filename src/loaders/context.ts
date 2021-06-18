import { User } from '@/models/Context';
import { Context as ContextOrm, User as UserOrm } from '@/store/orms';

import tokenUtils from '@/utils/token';
import { isAuthError } from '@/utils/error-handler';
import axios, { axiosEncrypt } from '@/utils/axios';
import envs from '@/utils/envs';
import originalAxios from 'axios';
import { getUserInfo } from '@/api/user';

// 通过token获取用户ID
export function getContextUserId() {
  const token = tokenUtils.get();
  if (!token) return undefined;
  const id = tokenUtils.get()?.split(':')[0];
  return id || undefined;
}

// 通过用户ID get User对象
export function getContextUser(): User | null {
  const id = getContextUserId();
  if (!id) {
    return null;
  }
  const contextUser = UserOrm.query().with(['resourceInfo']).whereId(id).first();
  return contextUser;
}

// set User对象
export async function setContextUser(user: User | Partial<User> | null) {
  await ContextOrm.insertOrUpdate({
    data: {
      _userId: user?.id,
      id: 1,
      user,
    },
  });
}

// 更新User对象
export async function updateContextUser(user?: User | Partial<User> | null) {
  let computedUser: User | Partial<User>;

  if (user === undefined) {
    computedUser = await getUserInfo();
  } else {
    const id: string | undefined = user?.id;
    // 如果没有id,则判断为局部修改,此时需调用getContextUserId获取id
    computedUser = id ? user! : { ...user, id: getContextUserId() };
  }
  await setContextUser(computedUser);
}

const pongDataPipesTimer: number | null = null;
const workspaceMsgCenterUninit: Function | null = null;


// 获取当前context
export async function updateContext() {
  const results = await Promise.allSettled([
    updateContextUser(),
    // originalAxios.get(`//${envs.VUE_APP_API_DOMAIN}/metaData/storageService/getResourceAuth`, {
    //   withCredentials: true,
    //   headers: {
    //     token: tokenUtils.get(),
    //   },
    // }),
  ]);
  const error = (results.find(result => 'reason' in result) as PromiseRejectedResult | undefined)?.reason;
  if (error) {
    if (isAuthError(error)) {
      await setContextUser(null);
    } else {
      throw error;
    }
  }
}

export async function clearContext() {
  setContextUser(null);
  if (pongDataPipesTimer) {
    clearInterval(pongDataPipesTimer);
  }
  // removeCompany();
  workspaceMsgCenterUninit && workspaceMsgCenterUninit();
}

export async function logout() {
  clearContext();
  tokenUtils.remove();
}
