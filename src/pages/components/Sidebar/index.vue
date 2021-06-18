<template>
  <el-menu class="main-home-sidebar" :default-active="defaultPath" router>
    <Menu :menuList="menus"></Menu>
  </el-menu>
</template>
<script lang="ts">
import usePermisson from '@/utils/uses/use-permisson';
import {
  defineComponent, reactive, toRefs, watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Menu from './components/menu.vue';
import './index.scss';

export default defineComponent({
  name: 'Sidebar',
  components: { Menu },
  props: {},
  setup() {
    const route = useRoute();
    const { isSupplier, isBuyer } = usePermisson();
    const state = reactive({
      defaultPath: '',
      menus: [{
        index: '/main/material-manage',
        title: '材料管理',
        icon: 'i-r-gongzuotai-16',
        show: isSupplier,
      }, {
        index: '/main/market',
        title: '公开市场',
        icon: 'i-r-gongkaishichang-16',
      }, {
        index: '/main/collection',
        title: '收藏夹',
        icon: 'i-r-shoucangjia-16',
      },
      {
        index: '/main/',
        title: '申请列表',
        icon: 'i-r-shenqingliebiao-16',
        childList: [
          {
            index: '/main/apply-record/sample',
            title: '样品申请',
            icon: '',

          },
          {
            index: '/main/apply-record/cooperation',
            title: '合作申请',
            icon: '',
          },

        ],
      }],
    });

    watch(() => route.path, (value) => {
      state.defaultPath = value;
    }, { immediate: true });
    return {
      ...toRefs(state),
      isSupplier,
      isBuyer,

    };
  },
});

</script>
<style lang="scss" >
</style>
