<template>
  <main class="comp-main">
    <div class="role">
      <h3 class="login-title">请选择注册的角色</h3>
      <ul class="role-choose">
        <li v-for="(item, i) of roles" :key="i" @click="chooseRole(item)">
          <div class="img-wrap">
            <img v-show="item.isActive" :src="item.activeImg" />
            <img v-show="!item.isActive" :src="item.img" />
          </div>
          <p class="name">{{ item.name }}</p>
          <p v-for="(title, i) of item.titles" :key="i">{{ title }}</p>
        </li>
      </ul>
      <el-button class="login-btn" :disabled="disabled" type="primary" @click="next">下一步</el-button>
      <p>已有账号,去<span class="text-link" @click="toLogin">登录</span></p>
    </div>
  </main>
</template>

<script lang="ts">
import { AccountType } from '@/api/account';
import {
  defineComponent, reactive, computed, ref, toRefs, PropType,
} from 'vue';
import {
  accountType, mainComponent,
} from '../utils/loginStore';

export default defineComponent({
  name: 'role',
  components: {},
  props: {
    resetPasswordType: {
      type: String as PropType<'reset' | 'bind'>,
    },
    qrcodeScene: {
      type: String,
    },
  },
  emits: ['change-component'],
  setup(props, { emit }) {
    const state = reactive({
      roles: [{
        accountType: 11 as const,
        name: '供应商',
        titles: ['材料发布推广', '买家需求响应'],
        isActive: false,
        img: require('@/assets/img/login/supplyer.png'),
        activeImg: require('@/assets/img/login/supplyer-active.png'),
      }, {
        accountType: 12 as const,
        name: '买家',
        titles: ['材料下单、调样申请', '需求发布'],
        isActive: false,
        img: require('@/assets/img/login/buyer.png'),
        activeImg: require('@/assets/img/login/buyer-active.png'),
      }],
    });
    const disabled = computed(() => !state.roles.some(item => item.isActive));
    const chooseRole = (role: GetArrayItem<typeof state.roles>) => {
      state.roles.forEach(item => {
        item.isActive = role.accountType === item.accountType ? !item.isActive : false;
      });
    };
    const next = () => {
      accountType.value = state.roles.find(item => item.isActive === true)?.accountType;
      if (props.resetPasswordType) {
        mainComponent.value = {
          name: 'reset-password',
          props: { type: props.resetPasswordType },
        };
      } else {
        mainComponent.value = {
          name: 'register',
          props: {},
        };
      }
    };
    const toLogin = () => {
      mainComponent.value = {
        name: 'login',
        props: {
          qrcodeScene: props.qrcodeScene,
        },
      };
    };
    return {
      ...toRefs(state), next, toLogin, chooseRole, accountType, disabled,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.role {
  .role-choose {
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 36px 0 20px 0;
      font-size: 12px;
      color: #999999;
      cursor: pointer;
      line-height: 18px;

      .img-wrap {
        width: 76px;
        height: 76px;
        margin-bottom: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .name {
        font-size: 16px;
        color: #222222;
        margin: 8px 0;
      }
    }
  }
}
</style>
