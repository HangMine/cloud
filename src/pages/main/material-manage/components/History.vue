<template>
  <div class="material-history" v-loading="loading">
    <ul>
      <li v-for="(item, i) of versionList" :key="i" class="history-item">
        <header class="flex-space-between">
          <div class="left">
            <h3 class="versionName">
              {{ getVersionName(item, i) }}
              <span v-if="item.isOm" class="public"><i class="i-r-banben-12"></i>公开市场版本</span>
            </h3>
            <small class="time">{{ dayjs(item.gmtCreateTime).format("YYYY.MM.DD HH:mm:ss") }}</small>
          </div>
          <div class="right">
            <div v-if="i === 0" class="current">当前版本</div>
            <template v-else>
              <span class="text-link" @click="preview(item)">预览</span>
              <el-divider direction="vertical"></el-divider>
              <span class="text-link" @click="resume(item)">恢复</span>
            </template>
          </div>
        </header>
        <main v-if="item.modifyLog">
          <div class="pre-decorate-text">更新日志</div>
          <SdCollapse collapseBy="height" :minHeight="60" :minHeightCollapsable="false">
            <ul>
              <li class="text-one-line" v-for="(logItem, i) in item.modifyLog" :key="i">{{ logItem }}</li>
            </ul>
          </SdCollapse>
        </main>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, onMounted,
} from 'vue';
import dayjs from 'dayjs';
import { confirm, dialog } from '@/utils/vue/dialog';
import { MaterialListItem } from '@/models/Material';
import * as api from '@/api/material';
import MaterialDetail from '@/pages/components/material/detail';
import SdCollapse from '@/components/collapse/SdCollapse';
import { editFormKeyMap } from '@/pages/components/material/components/MaterialForm/utils';

const modifyTypeTextMap = {
  UPDATE: '修改',
  INSERT: '补充',
  DELETE: '删除',
};
export default defineComponent({
  versionName: 'material-history',
  dialogify: {
    props: {
      title: '历史版本',
      width: '420px',
    },
  },
  components: { SdCollapse },
  props: {
    material: {
      type: Object as PropType<MaterialListItem>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      versionList: [] as (api.HistoryVersion & { modifyLog?: string[] | null })[],
      loading: false,
    });

    const preview = async (item: GetArrayItem<typeof state.versionList>) => {
      await dialog({
        is: MaterialDetail,
        props: {
          row: props.material,
          historyVersion: item,
          editable: false,
        },
      });
    };

    const setVersionList = async () => {
      try {
        state.loading = true;
        state.versionList = (await api.fetchVersionList(props.material.catalogId)).data;
        console.log(editFormKeyMap);
        state.versionList.forEach(version => {
          version.modifyLog = !version.note ? null : Object.entries(version.note).map(([key, val]) => {
            console.log(key);
            return `${modifyTypeTextMap[val]}了${editFormKeyMap[key]}`;
          });
        });
        // TODO: 测试数据,后删
        // state.versionList.forEach(item => {
        //   item.modifyLog = Array.from({ length: 10 }).fill('修改了材料适用产品');
        // });
      } finally {
        state.loading = false;
      }
    };


    const resume = async (item: GetArrayItem<typeof state.versionList>) => {
      await confirm({ title: '是否确定将此版本恢复成最新版？' });
      await api.resetVersion({
        catalogId: props.material.catalogId,
        relateId: item.relateId,
        isSync: false,
      });
      await setVersionList();
    };

    const getVersionName = (item: GetArrayItem<typeof state.versionList>, i: number) => {
      return `${item.versionName || '版本'} ${state.versionList.length - i}`;
    };

    onMounted(async () => {
      await setVersionList();
    });

    return {
      ...toRefs(state), dayjs, preview, resume, getVersionName,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.material-history {
  color: #222;
  .history-item {
    padding: 12px 0;
    box-shadow: 0px -1px 0px 0px #dddddd inset;
    font-size: 12px;
    .left {
      .versionName {
        font-size: 16px;
      }
      .time {
        display: block;
        color: #999999;
        margin-top: 5px;
      }
      .public {
        font-size: 12px;
        color: $color-primary;
        font-weight: 400;
        i {
          padding-right: 2px;
          padding-left: 5px;
        }
      }
    }
    .right {
      flex-shrink: 0;
      .current {
        padding: 6px 16px;
        border-radius: 16px;
        background: #e7f9f7;
        color: $color-primary;
      }
    }
    main {
      font-size: 14px;
      line-height: 20px;
      margin-top: 12px;
      padding-left: 7px;
    }
    .pre-decorate-text {
      position: relative;
      margin-bottom: 3px;
      &:before {
        content: "";
        display: block;
        width: 2px;
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: -7px;
        background-color: $color-primary;
      }
    }
  }
}
</style>
