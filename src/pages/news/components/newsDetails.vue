<template>
  <div class="news-details">
    <p class="title">{{ detailInfo["title"] }}</p>
    <div v-if="detailInfo['noticeType'] === 5" class="sample-content">
      <div class="notice-title">{{ detailInfo["noticeContent"] }}</div>
      <div class="notice-content">{{ detailInfo["noticeDetail"] && detailInfo["noticeDetail"][0].content }}</div>
    </div>
    <div v-if="detailInfo['noticeType'] === 3" class="sample-content">
      <p class="notice-title">材料名称</p>
      <p class="notice-content material-name">{{ detailInfo["noticeRelatedId"] }}</p>
      <p class="notice-title">该材料有以下材料信息变动：</p>
      <p class="notice-content material-list" v-for="(logItem, i) in modifyLog" :key="i">{{ logItem }}</p>
    </div>
    <div v-if="detailInfo['noticeType'] === 2" class="account-change">
      <div class="item">
        <p class="account-title">审核结果</p>
        <p class="content">{{ detailInfo["noticeContent"] }}</p>
      </div>
      <div class="item flex-space-between">
        <p class="account-title">申请时间</p>
        <p class="content">{{ detailInfo["createTime"] }}</p>
      </div>
      <div class="item flex-space-between">
        <p class="account-title">申请状态</p>
        <p class="content">已通过</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent, reactive, toRefs, onMounted,
} from '@vue/runtime-core';
import { getNoticeDetail, noticeItem } from '@/api/applyRecord';
import dayjs from 'dayjs';
import { editFormKeyMap } from '@/pages/components/material/components/MaterialForm/utils';

const modifyTypeTextMap = {
  UPDATE: '修改',
  INSERT: '补充',
  DELETE: '删除',
};
type modifyTypeText = 'UPDATE' | 'INSERT' | 'DELETE';
export default defineComponent({
  name: '',
  components: {},
  props: {
    detailId: {
      type: String,
    },

  },
  dialogify: {
    props: {
      title: '',
      width: '370px',
      closeOnClickModal: false,
    },
  },
  setup(props) {
    const state = reactive({
      detailInfo: {} as noticeItem,
      modifyLog: [] as Object[],
    });
    const getDetail = async () => {
      const res = await getNoticeDetail(props.detailId);
      res.createTime = res.gmtCreateTime && res.gmtCreateTime.substr(0, 10);
      state.detailInfo = res;
      if (res.noticeType === 3) {
        state.modifyLog = Object.entries(JSON.parse(res.noticeDetail[0].content)).map(([key, val]) => {
          return `${modifyTypeTextMap[val as modifyTypeText]}了${editFormKeyMap[key]}`;
        });
      }
    };
    onMounted(async () => {
      await getDetail();
    });
    return { ...toRefs(state) };
  },
});
</script>
<style lang="scss" scoped>
.news-details {
  position: relative;
  .title {
    font-size: 16px;
    position: absolute;
    top: -20px;
  }
  .sample-content {
    .notice-title {
      padding: 24px 0 9px;
      color: #888888;
      font-size: 12px;
    }
    .material-name {
      padding-bottom: 24px;
      border-bottom: 1px solid #eeeeee;
    }
    .material-list {
      line-height: 22px;
    }
  }
  .account-change {
    .item {
      padding: 24px 0;
      border-bottom: 1px solid #eeeeee;
      .account-title {
        color: #888;
        &:first-child {
          margin-bottom: 9px;
        }
      }
    }
  }
}
</style>
