<template>
  <div class="privacy-policy" v-html="html"></div>
</template>

<script lang="ts">
import loadMarkdown from '@/utils/load-markdown';
import i18n from '@/i18n';
import { defineComponent, onMounted, ref } from 'vue';
import envs from '@/utils/envs';

const Policy = defineComponent({
  name: 'TermsConditions',
  setup() {
    const html = ref<string>(null);
    onMounted(async () => {
      const { data: dom } = await loadMarkdown(`${envs.VUE_APP_POLICY_URL}/${i18n.language}/4DSTC_TERMS&CONDITIONS.md`);
      html.value = dom.innerHTML;
    });

    return {
      html,
    };
  },
});
export default Policy;
</script>

<style lang="scss" scoped>
/deep/ {
  h1 {
    font-size: 34px;
    font-weight: 400;
    text-align: center;
    margin-bottom: 20px;
  }
  h2 {
    margin-bottom: 30px;
    font-size: 18px;
    font-style: italic;
    font-weight: normal;
  }
  p {
    margin-bottom: 30px;
    font-size: 18px;
    line-height: 1.2;
    text-align: justify;
  }
  .highlight {
    color: #2878ff;
    text-decoration: underline;
  }
}
</style>
