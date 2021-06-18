<template>
  <div class="share-validation flex-1" :style="viewStyle">
    <img class="logo-img" src="@/assets/img/share/share-validation-logo.png" />
    <div class="info-box">
      <UserInfo class="info-con" :isDescriptionVisible="false" />
      <el-form class="form-box" :model="formData" size="small" ref="formVm">
        <p>请输入访问密码</p>
        <div class="input-box">
          <Password
            prop="code"
            class="pwd"
            v-model="formData.code"
            placeholder="访问密码"
            :rules="formRules"
            :maxlength="4"
          ></Password>
          <el-button class="btn" type="primary" @click="confirm">访问</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent, reactive, toRefs, ref,
} from 'vue';
import Password from '@/pages/login/components/inputs/Password.vue';
import { validateForm } from '@/utils/validators/validate-form';
import { ElForm } from 'element-plus';
// import UserInfo from '../../components/layout/Header/components/UserInfo';
import validator from '@/utils/validators/rules-validation';
import { useRoute, useRouter } from 'vue-router';
import * as api from '@/api/share';
import AppError from '@/utils/error';
import UserInfo from '../../components/Header/components/UserInfo';

export default defineComponent({
  name: 'share-validation',
  fullscreen: true,
  components: {
    UserInfo,
    Password,
  },
  setup() {
    const viewStyle = {
      backgroundImage: `url(${require('@/assets/img/share/share-validation-bg.png')})`,
    };
    const formVm = ref<typeof ElForm>();
    const { query: { shareId } } = useRoute();
    const router = useRouter();

    const formRules = [
      validator.requirement('blur'),
      validator.charFixedLength(4),
    ];
    const state = reactive({
      formData: {
        code: '',
      },
    });
    const confirm = async () => {
      await validateForm(formVm.value!);
      const { data: isValid } = await api.checkShareCode({ id: shareId, code: state.formData.code });
      if (isValid) {
        router.replace({ path: 'share', query: { shareId, valid: true } });
      } else {
        throw new AppError('访问密码错误');
      }
    };
    return {
      ...toRefs(state),
      viewStyle,
      formVm,
      formRules,
      confirm,
    };
  },

});

</script>
<style lang="scss" scoped>
.share-validation {
  background-color: #edf0f2;
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100%, 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .logo-img {
    width: 150px;
    margin: 196px 0 60px;
  }
  .info-box {
    width: 382px;
    background: #fff;
    border-radius: 4px;
    .info-con {
      padding: 24px 30px;
    }
    .form-box {
      border-top: 1px solid #eee;
      padding: 20px 30px;
      .input-box {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        /deep/ .pwd {
          width: 250px;
        }
        .btn {
          height: 32px;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
