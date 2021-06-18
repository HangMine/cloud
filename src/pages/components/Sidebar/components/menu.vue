<template>
  <div>
    <template v-for="item in menuList">
      <el-submenu
        v-if="item.childList && item.childList.length > 0 && (item.show || item.show === undefined)"
        :key="item.index"
        :index="item.index"
      >
        <template v-slot:title>
          <i :class="[item.icon]"></i>
          <span>{{ item.title }}</span>
        </template>
        <Menu :menuList="item.childList"></Menu>
      </el-submenu>
      <el-menu-item v-else-if="item.show || item.show === undefined" :index="item.index" :key="item.index">
        <i :class="[item.icon]"></i>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  props: {
    menuList: {
      type: Array,
    },
  },

});
</script>
<style lang="scss" scoped>
</style>
