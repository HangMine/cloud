<template>
  <h3>基础信息</h3>
  <el-form
    class="split-columns-form flex-wrap"
    :model="userInfo"
    :rules="formRules"
    size="small"
    label-position="top"
    ref="formRef"
  >
    <el-form-item label="用户名" prop="name">
      <el-input
        v-model="userInfo.name"
        placeholder="请输入用户名"
        @change="handleFormChange('name', $event)"
        :maxlength="32"
      ></el-input>
    </el-form-item>
    <el-form-item label="所属部门" prop="department">
      <el-input
        v-model="userInfo.department"
        placeholder="请输入部门"
        @change="handleFormChange('department', $event)"
        :maxlength="50"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, ref,
} from 'vue';
import { ElForm } from 'element-plus';
import { updateUserInfo } from '@/api/account';
import { getContextUser, updateContextUser } from '@/loaders/context';
import { User } from '@/models/Context';
import validWhitespace from '@/utils/validators/valid-white-space';
import strLength from '@/utils/validators/str-length';
import { validator2ElemRules } from '@/utils/validators/utils/validator-to-elem-rule';
import onCreated from '@/utils/vue/onCreated';

// export const nameRule = validator2ElemRule(validName, { trigger: 'blur' });

export default defineComponent({
  name: 'basic-info-form',
  emits: ['update'],
  setup(props, { emit }) {
    const formRules = {
      name: validator2ElemRules([validWhitespace, (value: string) => strLength(value, { max: 16 })], { trigger: 'blur' }),
      department: validator2ElemRules([validWhitespace, (value: string) => strLength(value, { max: 25 })], { trigger: 'blur' }),
    };
    const formRef = ref<InstanceType<typeof ElForm>>();
    const state = reactive({
      userInfo: {
        id: '',
        name: '',
        department: '',
      },
    });
    const getUserInfo = async () => {
      const userInfo = getContextUser() as User;
      ({
        id: state.userInfo.id,
        name: state.userInfo.name,
        department: state.userInfo.department,
      } = userInfo);
    };
    onCreated(() => getUserInfo());

    const handleFormChange = (field: keyof typeof state.userInfo, value: valueof<typeof state.userInfo>) => {
      formRef.value?.validateField(field, async (errMsg) => {
        if (errMsg) {
          return errMsg;
        }
        await updateUserInfo({
          [field]: value,
          id: state.userInfo.id,
        });
        await updateContextUser({ [field]: value });
        return true;
      });
    };

    return {
      ...toRefs(state),
      formRules,
      formRef,
      handleFormChange,
    };
  },
});
</script>

<style lang="scss" scoped>
h3 {
  font-weight: 600;
  margin-bottom: 20px;
}

.split-columns-form {
  margin-left: -15px;
  margin-right: -15px;
  margin-bottom: 20px;

  .el-form-item {
    width: 50%;
    padding: 0 15px;

    /deep/ .el-form-item__label {
      line-height: 28px;
      padding-bottom: 0;
    }
  }
}
</style>
