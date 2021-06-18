import {
  computed, defineComponent, reactive, render, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { getContextUser } from '@/loaders/context';
import isNeedValidLoginStatus from '@/router/utils/is-need-valid-login-status';
import Header from '@/pages/components/Header';
import Sidebar from '@/pages/components/Sidebar/index.vue';

import './index.scss';

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    fullscreen?: boolean
  }
}

export default defineComponent({
  name: 'page-main',
  components: {},
  props: {},
  setup(props, { emit }) {
    const route = useRoute();
    console.log(route.matched);
    const state = reactive({});
    const hideSidebar = computed(() => {
      const hideSidebarRoutes = ['/profile'];
      return hideSidebarRoutes.includes(route.path);
    });

    // 判断是否需要全屏展示: 页面配置有fullscreen:true表示该页面始终全屏显示,否则需根据是否登录判断是否全屏显示
    let isFullscreen = false;
    watch(() => route.path, () => {
      const user = getContextUser();
      if (isNeedValidLoginStatus(route) && !user) {
        isFullscreen = true;
      } else {
        const lastRoute = route.matched[route.matched.length - 1];
        isFullscreen = lastRoute.components.default?.fullscreen || false;
      }
    }, { immediate: true });

    return () => (
      isFullscreen
        ? (<router-view class="router-view"></router-view>)
        : (<div class="page-main flex-column">
          <Header></Header>
          <div class="main">
            <Sidebar v-show={!hideSidebar.value}></Sidebar>
            <div class="content flex-column flex-1">
              <router-view class="router-view"></router-view>
            </div>
          </div>
        </div>)
    );
  },
});
