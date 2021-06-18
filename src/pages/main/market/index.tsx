import {
  defineComponent, reactive, render, createApp, ref,
  computed,
} from 'vue';
import SdTable from '@/components/sd-table/index';
import '@/pages/main/material-manage/index.scss';
import { dialog, confirm } from '@/utils/vue/dialog';
import MaterialUploadComp from '@/pages/components/material/upload/index.vue';
import MaterialDetailComp from '@/pages/components/material/detail/index.vue';
import MaterialViewer from '@/pages/components/material/viewer/index.vue';
import { fetchMaterial, fetchMarketMaterialList } from '@/api/material';
import {
  MaterialStatus, materialStatus, materialStatusOptions, SharedMaterialItem, MaterialList,
} from '@/models/Material';

import * as api from '@/api/material';
import tryParseJson from '@4dst-saas/public-utils/dist/try-parse-json';
import { getContextUser, updateContextUser } from '@/loaders/context';
import AppError from '@/utils/error';
import { fetchUserAuditStatus } from '@/api/account';
import onCreated from '@/utils/vue/onCreated';
import CollapseSearchFilter from '@/components/CollapseSearchFilter';
import ApplySample from '@/pages/main/applyRecord/components/dialog/handleApply.vue';
import { ElMessage } from 'element-plus';
import classnames from 'classnames';
import { getMaterialImg } from '@/pages/components/material/utils';


const columns = [{
  key: 'imgUrl',
  title: '材料图片',
}, {
  key: 'name',
  title: '材料名称',
}, {
  key: 'colorInfo',
  title: '色卡',
  minWidth: 210,
  showOverflowTooltip: false,
},
// {
//   key: 'tag',
//   title: '材料状态',
// },
// {
//   key: 'isAgain',
//   title: '被分享权限',
// },
// {
//   key: 'shareTotal',
//   title: '材料被分享次数',
// },
{
  key: 'sn',
  title: '供应商货号',
}, {
  key: 'isCollect',
  title: '是否已收藏',
  width: 102,
}, {
  key: 'year',
  title: '年份',
}, {
  key: 'season',
  title: '季度',
}, {
  key: 'applicableProduct',
  title: '适用产品',
}, {
  key: 'physicalSamplePrice',
  title: '实物样品费用',
}, {
  key: 'physicalSampleLeadTime',
  title: '实物样本生产周期',
}];


// const form:FormItems = [{
//   key: 'categoryId',
//   title: '',
//   type: 'select',
//   value: '',
//   options: [{
//     key: '',
//     title: '全部材料类型',
//   }],
//   formItemProps: {
//     style: {
//       width: '160px',
//     },
//   },
// }, {
//   key: 'tag',
//   title: '',
//   type: 'select',
//   value: '',
//   options: [{
//     key: '',
//     title: '全部材料状态',
//   }, ...materialStatusOptions as Options],
//   formItemProps: {
//     style: {
//       width: '160px',
//     },
//   },
// }, {
//   key: 'keywords',
//   title: '',
//   placeholder: '输入关键词',
//   prefixIcon: 'el-icon-search',
//   formItemProps: {
//     style: {
//       width: '160px',
//     },
//   },
// }];

const statusColorMap = {
  待上架: 'green',
  已上架: 'blue',
  已下架: 'gray',
};


export default defineComponent({
  name: 'market',
  components: {},
  props: {},
  setup(props, { emit }) {
    const tableVm = ref<InstanceType<typeof SdTable>>();
    const state = reactive({
      rows: [] as SharedMaterialItem[],
      params: {
        keywords: '',
        fields: {
          categoryId: [],
        } as unknown as api.MaterialSearchFields,
      },
    });

    // 进入页面时更新用户审核状态
    const updateUserAuditStatus = async () => {
      const res = await fetchUserAuditStatus();
      await updateContextUser({ status: res });
    };
    // updateUserAuditStatus();
    // const testError = async () => {
    //   throw Error('test Error');
    // };

    onCreated(() => updateUserAuditStatus());

    const user = computed(() => getContextUser());

    const loadTable = async () => {
      await tableVm.value?.load();
    };
    const searchTable = () => {
      tableVm.value?.search();
    };
    const uploadMaterial = async () => {
      await dialog({
        is: MaterialUploadComp,
      });
      searchTable();
    };

    const mutiCollect = async (_rows: SharedMaterialItem[] = state.rows) => {
      const obj = _rows.find(item => user?.value?.id === item.creator);
      if (obj) {
        ElMessage.error('不可自己收藏自己的材料,请重新选择');
        return;
      }
      await api.collectMaterial(_rows.map(row => row.catalogId));
      ElMessage.success('收藏材料成功');
      await loadTable();
    };
    const switchCollectStatus = async (_row: SharedMaterialItem) => {
      const { isCollect } = _row;
      if (isCollect && user?.value?.id === _row.creator) {
        ElMessage.error('不可自己收藏自己的材料');
        return;
      }
      const requestCollect = isCollect ? 'cancelCollectMaterial' : 'collectMaterial';
      await api[requestCollect]([_row.catalogId]);
      ElMessage.success(isCollect ? '取消收藏材料成功' : '收藏材料成功');
      loadTable();
    };
    const applySample = async (_row: SharedMaterialItem) => {
      const res = (await fetchMaterial(_row.catalogId)).data;
      if (user?.value?.id === _row.creator) {
        ElMessage.error('不可自己向自己申请样品');
        return;
      }
      if (res.isApply) {
        ElMessage.warning('您已申请过该材料，请耐心等待申请结果！');
        return;
      }

      await dialog({
        is: ApplySample,
        props: {
          title: '申请内容',
          placeholder: '请输入',
          submitType: 'applySample',
          appendRequestParams: {
            approver: _row.creator,
            applyType: 2,
            sampleId: _row.catalogId,
            originalCId: _row.originalCId,
            sampleName: _row.name,
            categoryId: _row.categoryId,
            approverOrgId: res.attributeInfo.orgId,
          },
        },
      });

      searchTable();
    };

    const detail = async (row:SharedMaterialItem) => {
      await dialog({
        is: MaterialDetailComp,
        props: {
          row,
        },
      });
    };

    const handleSelection = (_rows:SharedMaterialItem[]) => {
      state.rows = _rows;
    };
    // const calcSelectable = (_row:SharedMaterialItem) => {
    //   return _row.isCollect;
    // };
    const viewer = async (row: SharedMaterialItem) => {
      await dialog({
        is: MaterialViewer,
        props: {
          catalogId: row.catalogId,
        },
      });
    };


    const parseApplicableProduct = (value?:string[]) => {
      if (!value) return '--';
      return value.join();
    };

    const getMaterialList = (params) => {
      Object.entries(params.fields).forEach(([key, val]) => {
        if (!val) {
          delete params.fields[key];
        }
      });
      return fetchMarketMaterialList(params);
    };

    const saveSearchFormParams = (currentParams: {[key: string]: any}) => {
      const { keywords, ...otherParams } = currentParams;
      state.params = { ...state.params, keywords, ...{ fields: { ...state.params.fields, ...otherParams } } };
    };

    return () => (
      <div class="public-market">
        <SdTable
          ref={tableVm}
          title="公开市场"
          params={state.params}
          fetchTable={getMaterialList}
          showRowId
          columns={columns}
          // rows={rows}
          // form={form}
          onSelection={(_rows: SharedMaterialItem[]) => handleSelection(_rows)}
          selectable={(_row: SharedMaterialItem) => !_row.isCollect}
          tool={{
            width: 270,
          }}
          // handleParams={handleParams}
          // formSlots={{
          //   categoryId: () => (
          //     <CategoryCascader onChange={handleCascaderChange} clearable></CategoryCascader>
          //   ),
          // }}
          v-slots={{
            formItem: ({ searchFn }: { searchFn: () => void }) => (
              <CollapseSearchFilter
                isMarketPage={true}
                handleChange={(currentParams: {[key: string]: any}) => {
                  saveSearchFormParams(currentParams);
                  searchFn();
                }}
              ></CollapseSearchFilter>
            ),
            btns: () => {
              const getBtnClass = () => {
                return classnames(['text-link', { 'h-disabled': !state.rows.length }]);
              };
              return (
                <div>
                  <span class={getBtnClass()} onClick={() => mutiCollect()}>收藏</span>
                </div>
              );
            },
            tool: ({ row }:{row:SharedMaterialItem}) => (
              <div>
                <span class="text-link" onClick={() => detail(row)}>查看</span>
                <el-divider direction="vertical"></el-divider>
                <span class="text-link" onClick={() => viewer(row)}>3D预览</span>
                <el-divider direction="vertical"></el-divider>
                <span class="text-link" onClick={() => switchCollectStatus(row)} style="width: 56px">{row.isCollect ? '取消收藏' : '收藏'}</span>
                <el-divider direction="vertical"></el-divider>
                <span class="text-link" onClick={() => applySample(row)}>申请样品</span>
              </div>
            ),
            imgUrl: ({ row }:{row:SharedMaterialItem}) => {
              return (
                <div class="table-img">
                  <base-image src={getMaterialImg(row)} ></base-image>
                </div>
              );
            },
            tag: ({ row }:{row:SharedMaterialItem}) => {
              const color = statusColorMap[row.tag];
              return <span class={color}>{row.tag}</span>;
            },
            isAgain: ({ row }:{row:SharedMaterialItem}) => {
              row.isAgainText = row.isAgain === 0 ? '不可分享' : '允许分享';
              return row.isAgainText;
            },
            isCollect: ({ row }:{row:SharedMaterialItem}) => {
              return row.isCollect ? '是' : '否';
            },
            // season: ({ row }:{row:SharedMaterialItem}) => {
            //   return <span>{row.season.join()}</span>;
            // },
            // applicableProduct: ({ row }:{row:SharedMaterialItem}) => {
            //   return <span>{row.applicableProduct.join()}</span>;
            // },
            // surfaceTechnology: ({ row }:{row:SharedMaterialItem}) => {
            //   return <span>{Array.isArray(row.surfaceTechnology) ? row.surfaceTechnology.join() : row.surfaceTechnology}</span>;
            // },
            // materialtechnology: ({ row }:{row:SharedMaterialItem}) => {
            //   return <span>{row.materialtechnology.join()}</span>;
            // },
            colorInfo: ({ row }:{row:SharedMaterialItem}) => {
              const colors = row.renderingInfo.slice(0, 3);
              const showColor = row.renderingInfo.find(color => color.isDefault) || colors[0] || {};
              const TextSpan = (color:GetArrayItem<typeof colors>) => {
                return <span class="color-cell">
                  <span class="color-name">{color.name}</span>
                  <span class="color-family">/{color.colorFamily}</span>
                </span>;
              };
              return colors.length > 1 ? <el-dropdown class="color-info-dropdown-table" trigger="click" v-slots={{
                dropdown() {
                  return (
                    <el-dropdown-menu class="color-info-dropdown">
                      {
                        colors.map(color => (
                          <el-dropdown-item >{TextSpan(color)}</el-dropdown-item>
                        ))
                      }
                      <el-dropdown-item divided class="more-color-info" onClick={() => detail(row)}>查看更多</el-dropdown-item>
                    </el-dropdown-menu>
                  );
                },
              }}>
                <span class="color-info-table">
                  {TextSpan(showColor)}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>

              </el-dropdown>
                : <over-text class="color-info-table">
                  {TextSpan(showColor)}
                </over-text>;
            },
            applicableProduct: ({ row }:{row:SharedMaterialItem}) => {
              return <span>{parseApplicableProduct(tryParseJson(row.applicableProduct)) }</span>;
            },
          }}>

        </SdTable>
      </div>
    );
  },
});
