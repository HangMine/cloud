<template>
  <div></div>
  <!-- <MaterialManage v-if="isSupplier"></MaterialManage>
  <Market v-else-if="isBuyer"></Market> -->
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import MaterialManage from '@/pages/main/material-manage/index';
import Market from '@/pages/main/market/index';
import usePermisson from '@/utils/uses/use-permisson';
import router from '@/router';

export default defineComponent({
  name: 'home',
  props: {},
  setup(props, { emit }) {
    const state = reactive({});
    const { isSupplier, isBuyer } = usePermisson();
    const redirect = () => {
      const redirectUrl = isSupplier.value ? '/main/material-manage' : '/main/market';
      router.push({ path: redirectUrl });
    };
    redirect();
    return {
      ...toRefs(state), isSupplier, isBuyer,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.home {
}
</style>
