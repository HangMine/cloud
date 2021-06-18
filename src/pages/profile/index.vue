<template>
  <Header></Header>
  <div class="page-profile">
    <sd-breadcrumb></sd-breadcrumb>
    <div class="main">
      <!--    <div class="user-info">-->
      <!-- 用户头像和信息 -->
      <UserInfoBrief></UserInfoBrief>
      <BasicInfoForm></BasicInfoForm>
      <CompanyInfoForm></CompanyInfoForm>
      <!--    </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Header from '../components/Header';
import UserInfoBrief from './components/UserInfoBrief.vue';
import BasicInfoForm from './components/form/BasicInfoForm.vue';
import CompanyInfoForm from './components/form/CompanyInfoForm.vue';

// import { getContextUser } from '@/loaders/context';
// import { User } from '@/models/Context';

export default defineComponent({
  name: 'profile',
  breadCrumb: [{
    path: '/profile',
    title: '个人中心',
  }],
  components: {
    UserInfoBrief,
    BasicInfoForm,
    CompanyInfoForm,
    Header,
  },
  setup() {
    // const userInfo = getContextUser() as User;
    // const userImage = computed(() => userInfo.headImg || require('@/assets/img/header/default_avatar.png'));
    // const handleChangeEmail = () => {
    //   console.log(111);
    // };
    // const handleChangePassword = () => {
    //   console.log(222);
    // };
    const updateUserInfo = () => {
      console.log('update');
    };
    // 修改公司信息
    const updateCompanyInfo = async ({ field, value }) => {
      // try {
      //   await updateCompanyInfo({
      //     [field]: value,
      //     id: this.company.id,
      //   });
      // } catch (err) {
      //   this.$errHandler(err);
      // }
    };
    return {
      updateUserInfo,
      updateCompanyInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
.page-profile {
  width: 1200px;
  margin: 0 auto 20px;
  .main {
    box-shadow: 0 5px 10px 0 rgba(54, 74, 107, 0.1);
    background: #ffffff;
    padding: 30px 30px 40px;
  }
}
</style>
