<template>
  <div class="sd-breadcrumb">
    <span>
      <span class="back-btn" @click="back"> <i class="back-icon i-r-zuo-12"></i>返回 </span>
      <el-divider direction="vertical"></el-divider>
    </span>
    <el-breadcrumb class="sd-breadcrumb-main" separator="/">
      <el-breadcrumb-item v-for="(item, i) of breadCrumbData" :key="i" :to="{ path: item.path }">{{
        item.title
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getHomeRedirect } from '@/pages/login/utils/loginStore';

type BreadCrumbData = { path: string, title: string }[];

export default defineComponent({
  name: 'sd-breadcrumb',
  components: {},
  props: {
    data: {
      type: Array as PropType<BreadCrumbData>,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      breadCrumbData: [] as BreadCrumbData,
    });

    const getBreadCrumbData = () => {
      if (props.data) return props.data;
      const componentOptions = route.matched[0].components.default;
      const { breadCrumb } = componentOptions;
      return breadCrumb;
    };

    const setBreadCrumbData = () => {
      state.breadCrumbData = getBreadCrumbData();
    };

    const back = async () => {
      router.push(await getHomeRedirect());
    };

    const init = () => {
      setBreadCrumbData();
    };

    init();
    return {
      ...toRefs(state), back,
    };
  },
});

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    breadCrumb?: BreadCrumbData
  }
}
</script>
<style lang="scss" scoped>
// @import 'url'
.sd-breadcrumb {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 20px;
  color: #666666;
  .back-btn {
    cursor: pointer;
    .back-icon {
      margin-right: 5px;
    }
  }
  .sd-breadcrumb-main {
    // display: inline-block;
  }
}
</style>
