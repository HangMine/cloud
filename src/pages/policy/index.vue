<template>
  <div class="policy-container">
    <div class="policy-content">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
#app {
  min-width: auto;
}
</style>
<style lang="scss" scoped>
.policy-container {
  background-color: #f4f7fc;

  .policy-content {
    max-width: 1200px;
    padding: 50px;
    margin: 0 auto;
    background-color: #fff;
  }
}
</style>
