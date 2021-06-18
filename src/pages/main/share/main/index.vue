<template>
  <div class="supplier-share-main flex-column flex-1">
    <header class="flex-space-between">
      <el-checkbox
        v-model="isCheckAll"
        :indeterminate="isIndeterminate"
        :disabled="isBatchCheckDisable"
        @change="handleCheckAll"
        >已选{{ checkedList.length }}个</el-checkbox
      >
      <el-button type="primary" size="mini" :disabled="isBatchShareDisable" @click="showShareDialog(checkedList)"
        >分享</el-button
      >
    </header>
    <main class="flex-wrap flex-1">
      <MaterialBox
        v-for="(material, i) in materialList"
        :key="i"
        :index="i"
        :materialItem="material"
        :canShareAgain="canShareAgain"
        @check="handleCheckItem"
        @collect="handleCollectItem"
        @share="showShareDialog"
        @detail="showDetailDialog"
      />
      <Intersect @enter="loadMore" class="intersect-wrapper flex-center" v-if="canLoadMore">
        <div class="load-more el-loading-spinner" v-if="loading">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none"></circle>
          </svg>
        </div>
        <div v-else>滚动加载更多</div>
      </Intersect>
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed, onMounted, PropType,
} from 'vue';
import Intersect from '@/components/scroll/intersect';
import deepCopy from '@/utils/deep-copy';
import { fetchMaterial, collectMaterial, cancelCollectMaterial } from '@/api/material';
import MaterialDetailComp from '@/pages/components/material/detail/index.vue';
import { dialog, confirm } from '@/utils/vue/dialog';
import * as api from '@/api/share';
import {
  MaterialDetail, SharedMaterialItem,
} from '@/models/Material';
import Share from '@/pages/components/share/index.vue';
import { getContextUser } from '@/loaders/context';
import { ElMessage } from 'element-plus';
import { checkShare } from '@/pages/components/util';
import MaterialBox from '../components/MaterialBox.vue';

const mitem = {
  applicableProduct: '[["鞋履","男鞋"],["鞋履","女鞋"]]',
  catalogId: '1382650854642835458',
  categoryId: '11',
  colorFamily: '',
  colorName: '',
  creator: '1380100182536654850',
  gmtCreateTime: null,
  gmtModifyTime: null,
  id: '16065376869675008',
  imgUrl: '',
  isInStock: 1,
  modifier: '1380100182536654850',
  name: '测试适用产品2',
  physicalSampleLeadTime: '5',
  physicalSampleLeadTimeUnit: '天',
  physicalSamplePrice: '4',
  physicalSamplePriceUnit: '人民币',
  renderingInfo: [
    {
      colorName: 'rgb(225, 62, 62)',
      colorFamily: '红色',
      materialId: '16065376869675008',
    },
  ],
  season: '春,夏',
  sn: '1',
  supplierLocation: '',
  supplierName: '',
  tag: '待上架',
  year: '2',
};
const list = Array(20).fill(1).map(() => deepCopy(mitem));

export default defineComponent({
  name: 'supplier-share-main',
  components: {
    Intersect,
    MaterialBox,
  },
  props: {
    canShareAgain: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      require: true,
    },
    shareInfo: {
      type: Object as PropType<AsyncReturnType<typeof api.fetchShareConfig>['data']>,
      required: true,
    },
  },
  setup(props) {
    const state = reactive({
      isCheckAll: false,
      isIndeterminate: false,
      // checkedNum: 0,
      listStat: {
        total: 0,
        current: 1,
        size: 10,
      },
      materialList: [] as SharedMaterialItem[],
      loading: true,
    });
    const user = computed(() => getContextUser());
    const checkedList = computed(() => state.materialList.filter(item => item.isChecked));
    const canLoadMore = computed(() => {
      // 初始化时显示
      if (state.loading && !state.listStat.total) {
        return true;
      }
      return state.listStat.total / state.listStat.size > state.listStat.current;
    });
    const isBatchCheckDisable = computed(() => state.materialList.length === 0 || !props.canShareAgain);
    const isBatchShareDisable = computed(() => isBatchCheckDisable.value || checkedList.value.length === 0 || !checkShare(checkedList.value));

    const getMaterialsList = async () => {
      state.loading = true;
      const res = await api.fetchShareMaterialList(props.shareId!);
      const {
        current, size, records, total,
      } = res.data;
      state.listStat.current = current;
      state.listStat.size = size;
      state.listStat.total = total;
      const newRecords = records.map(record => ({ ...{ isChecked: false, isCollect: false }, ...record }));
      state.materialList = [...state.materialList, ...newRecords];
      state.loading = false;
    };
    // getMaterialsList();

    const loadMore = async () => {
      console.log('enter intersect');
      if (!canLoadMore.value) {
        return;
      }
      await getMaterialsList();
    };

    // const leaveIntersect = () => {
    //   console.log('leave intersect');
    // };
    const handleCheckItem = (index: number, materialItem: SharedMaterialItem) => {
      const { isChecked } = materialItem;
      state.materialList[index].isChecked = !isChecked;
      const checkedListCount = checkedList.value.length;
      state.isCheckAll = checkedListCount === state.materialList.length;
      state.isIndeterminate = checkedListCount > 0 && checkedListCount < state.materialList.length;
    };
    const handleCollectItem = async (index: number, materialItem: SharedMaterialItem) => {
      const { isCollect } = materialItem;
      if (isCollect && user?.value?.id === materialItem.creator) {
        ElMessage.error('不可对材料进行重复操作');
        return;
      }
      const requestCollect = isCollect ? cancelCollectMaterial : collectMaterial;
      await requestCollect([materialItem.catalogId]);
      state.materialList[index].isCollect = !isCollect;
    };

    const handleCheckAll = (val: boolean) => {
      state.materialList.forEach(item => {
        item.isChecked = val;
      });
      state.isIndeterminate = false;
    };

    const showShareDialog = async (materials: SharedMaterialItem[]) => {
      const obj = materials.find(item => user?.value?.id !== item.creator && item.isAgain === 0);
      if (obj) {
        ElMessage.error('不可对材料进行重复操作');
        return;
      }
      await dialog({
        is: Share,
        props: {
          materials,
          shareInfo: props.shareInfo,
          showConfig: true,
        },
      }, {
        noTitle: true,
        props: {
          width: '705px',
        },
      });
    };

    const showDetailDialog = async (materialItem: MaterialDetail) => {
      await dialog({
        is: MaterialDetailComp,
        props: {
          row: materialItem,
          editable: false,
        },
      });
    };

    // loadMore();
    return {
      ...toRefs(state),
      checkedList,
      canLoadMore,
      isBatchCheckDisable,
      isBatchShareDisable,
      loadMore,
      handleCheckItem,
      handleCollectItem,
      handleCheckAll,
      // leaveIntersect,
      showDetailDialog,
      showShareDialog,
    };
  },
});
</script>

<style lang="scss" scoped>
.supplier-share-main {
  height: 0;
}
header {
  height: 46px;
  padding: 0 20px;
  background-color: #fff;
  // margin-bottom: 30px;
  // box-shadow: 0px 3px 6px 0px rgba(128, 128, 128, 0.18);
  .el-button {
    min-height: 24px !important;
  }
}
main {
  align-items: flex-start;
  padding: 30px 10px 0;
  overflow-y: auto;
}
.material-box {
  padding: 0 10px;
}
.intersect-wrapper {
  width: 100%;
  height: 50px;
  align-self: flex-end;
  .el-loading-spinner {
    position: static;
    margin-top: 0;
  }
}
// 侧边宽: 220px
// 2800～3155 11
@media screen and (max-width: 3320px) {
  .material-box {
    width: 0.91%;
  }
}
// 2500～2800 10
@media screen and (max-width: 2720px) {
  .material-box {
    width: 10%;
  }
}
// 2200～2500 9
@media screen and (max-width: 2720px) {
  .material-box {
    width: 11.11%;
  }
}
// 1900～2200 8
@media screen and (max-width: 2420px) {
  .material-box {
    width: 12.5%;
  }
}
// 1600～1900 7
@media screen and (max-width: 2120px) {
  .material-box {
    width: 14.28%;
  }
}
// 1300～1600 6
@media screen and (max-width: 1820px) {
  .material-box {
    width: 16.66%;
  }
}
// 1200-1300 5
@media screen and (max-width: 1520px) {
  .material-box {
    width: 20%;
  }
}
</style>
