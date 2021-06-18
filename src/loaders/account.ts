import { User } from '@/models/Context';
import axios from '@/utils/axios';

export type UserObj = Record<string, User>;


export const getUsersInfoByIds = async (userIds: string[]) => {
  const noRepeatUserIds = [...new Set(userIds)];
  const res = await axios.post<User[]>('/authcenter/user/im/info', noRepeatUserIds);
  const usersObj = res.data.reduce((obj, user) => {
    obj[user.id] = user;
    return obj;
  }, {} as UserObj);
  res.data = noRepeatUserIds.map(id => usersObj[id]);
  return res;
};

export const getUsersObjByIds = async (userIds: string[]) => {
  const noRepeatUserIds = [...new Set(userIds)];
  const res = await axios.post<User[]>('/authcenter/user/im/info', noRepeatUserIds);
  const usersObj = res.data.reduce((obj, user) => {
    obj[user.id] = user;
    return obj;
  }, {} as UserObj);
  return { ...res, data: usersObj };
};


