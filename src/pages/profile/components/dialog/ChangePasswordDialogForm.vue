<template>
  <el-form :model="formData" size="small" ref="formVm">
    <Password
      prop="oldPassword"
      v-model="formData.oldPassword"
      label="请输入原密码"
      autocomplete="new-password"
      :rules="complexPwRule"
    ></Password>
    <Password
      v-model="formData.password"
      label="请输入新密码"
      autocomplete="new-password"
      :rules="complexPwRule"
    ></Password>
    <Password
      v-model="formData.repeatPassword"
      label="请确认新密码"
      autocomplete="new-password"
      :rules="repeatPwRule"
    ></Password>
    <div class="dialog-footer flex-justify-flex-end">
      <el-button @click="cancelForm">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-form>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRef, toRefs, ref,
} from 'vue';
import Password, { complexPwRule } from '@/pages/login/components/inputs/Password.vue';
import useRepeatPwRule from '@/pages/login/utils/useRepeatPwRule';
import { validateForm } from '@/utils/validators/validate-form';
import { ElForm } from 'element-plus';
import { updatePassword } from '@/api/account';

export default defineComponent({
  components: {
    Password,
  },
  dialogify: {
    props: {
      title: '修改登录密码',
      width: '430px',
    },
  },
  setup(props, { emit }) {
    const formVm = ref<typeof ElForm>();
    const state = reactive({
      formData: {
        oldPassword: '',
        password: '',
        repeatPassword: '',
      },
    });
    const repeatPwRule = useRepeatPwRule(toRef(state.formData, 'repeatPassword'));
    const cancelForm = async () => {
      emit('cancel');
    };
    const submitForm = async () => {
      await validateForm(formVm.value!);
      await updatePassword({
        pass: state.formData.oldPassword,
        newPass: state.formData.password,
      });
      emit('confirm');
    };

    return {
      ...toRefs(state),
      formVm,
      submitForm,
      cancelForm,
      complexPwRule,
      repeatPwRule,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: 20px;
}
</style>
