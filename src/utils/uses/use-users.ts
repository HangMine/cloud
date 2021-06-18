import { getUsersObjByIds, UserObj } from '@/loaders/account';
import {
  watch,
  onMounted,
  reactive, Ref, ref, toRefs,
} from 'vue';


const userUsers = (refUserIds: Ref<string[]>) => {
  const userObj = ref<UserObj>({});
  watch(async () => {
    if (!refUserIds.value.length) return;
    userObj.value = (await getUsersObjByIds(refUserIds.value)).data || {};
    // @ts-ignore
  }, { immediate: true });

  return userObj;
};

export default userUsers;
