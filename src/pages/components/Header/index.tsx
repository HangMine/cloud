import { getContextUser, logout } from '@/loaders/context';
import { getHomeRedirect, mainComponent } from '@/pages/login/utils/loginStore';
import { computed, defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import UserInfo from './components/UserInfo';
import './index.scss';

export default defineComponent({
  name: 'Header',
  components: {},
  props: {},
  setup(props, { emit }) {
    const router = useRouter();
    const goProfile = () => {
      router.push('/profile');
    };
    const goNews = () => {
      router.push('/news');
    };
    const _logout = async () => {
      await logout();
      mainComponent.value = {
        name: 'login',
        props: {},
      };
      router.push('/login');
    };
    return () => (
      <div class="home-header flex-space-between">
        <img src={require('@/assets/img/login/logo-register.png')} class="logo"></img>
        <el-dropdown trigger="click" v-slots={{
          dropdown: () => (
            <el-dropdown-menu>
              <el-dropdown-item onClick={goProfile}>个人中心</el-dropdown-item>
              <el-dropdown-item onClick={goNews}>消息</el-dropdown-item>
              <el-dropdown-item onClick={_logout}>退出</el-dropdown-item>
            </el-dropdown-menu>
          ),
        }}>
          <UserInfo />
        </el-dropdown>

      </div>
    );
  },
});
