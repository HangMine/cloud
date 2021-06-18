<template lang="html">
  <!-- eslint-disable-next-line -->
  <el-popover width="600" trigger="hover" :content="$t('upload.disclaimer.content')">
    <template #reference>
      <div class="disclaimer-buttion">
        <i class="iconfont iconmianzeshengming1" />
        <span>{{ $t('upload.disclaimer.button') }}</span>
      </div>
    </template>

  </el-popover>
</template>

<style lang="scss" scoped>
.disclaimer-desc {
  padding: 10px 15px;
  font-size: 14px;
  line-height: 24px;
  word-break: break-word;
}

.disclaimer-buttion {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 18px 0 6px;
  margin-left: 20px;
  font-size: 12px;
  font-weight: 400;
  border: 1px solid #ddd;
  border-radius: 14px;
  cursor: pointer;
  transition: all linear 150ms;
  &:hover {
    border-color: transparent;
    box-shadow: 0px 0px 8px 0px rgba(136, 149, 172, 0.3);
  }

  > .iconfont {
    margin-right: 3px;
    font-size: 18px;
    color: #f2b334;
  }
}
</style>
