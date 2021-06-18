<template>
  <p class="virtual-sample-link">
    <span>{{ $t('upload.virtualSample.no_sample') }}</span>
    <router-link
      :to="{ name: 'ServiceSample' }"
      class="text-link underline"> {{ $t('upload.virtualSample.get_sample') }}</router-link>
  </p>
</template>

<style lang="scss" scoped>
.virtual-sample-link {
  font-size: 12px;
  line-height: 30px;
  color: #636363;

  .underline {
    text-decoration: underline;
  }
}
</style>
