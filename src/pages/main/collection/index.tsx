import {
  defineComponent, reactive, render, createApp, ref, watch, computed,
} from 'vue';
import SdTable from '@/components/sd-table/index';
import '@/pages/main/material-manage/index.scss';
import './index.scss';
import { dialog, confirm } from '@/utils/vue/dialog';
import MaterialDetailComp from '@/pages/components/material/detail/index.vue';
import { FormItems, Options } from '@/components/form/HForm/type';
import { getContextUser } from '@/loaders/context';
import MaterialViewer from '@/pages/components/material/viewer/index.vue';
import {
  MaterialStatus, materialStatus, materialStatusOptions, MaterialListItem, MaterialList,
} from '@/models/Material';
import { fetchMaterial } from '@/api/material';

import CategoryCascader from '@/components/form/cascader/CategoryCascader.vue';
import classnames from 'classnames';
import * as api from '@/api/material';
import { untilLoaded } from '@/utils/open-window';
import tryParseJson from '@4dst-saas/public-utils/dist/try-parse-json';
import Share from '@/pages/components/share/index.vue';
import CollapseSearchFilter from '@/components/CollapseSearchFilter';
import { ElMessage } from 'element-plus';
import usePermisson from '@/utils/uses/use-permisson';
import ApplySample from '@/pages/main/applyRecord/components/dialog/handleApply.vue';
import { checkShare } from '@/pages/components/util';
import { getMaterialImg } from '@/pages/components/material/utils';

type Command = 'viewer'|'applySample';

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
{
  key: 'isAgain',
  title: '被分享权限',
},
// {
//   key: 'tag',
//   title: '材料状态',
// },
// {
//   key: 'shareTotal',
//   title: '材料被分享次数',
// },
{
  key: 'sn',
  title: '供应商货号',
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
  name: 'collect',
  components: {},
  props: {},
  setup(props, { emit }) {
    const { isSupplier, isBuyer } = usePermisson();

    const tableVm = ref<InstanceType<typeof SdTable>>();
    const state = reactive({
      rows: [] as MaterialList,
      params: {
        keywords: '',
        fields: {
          tag: '',
          categoryId: [],
        } as unknown as api.MaterialSearchFields,
      },

    });
    const loadTable = () => {
      tableVm.value?.load();
    };
    const searchTable = () => {
      tableVm.value?.search();
    };


    function mutiCheck(passStatus:MaterialStatus[]);
    function mutiCheck(checkFn:(row:MaterialListItem)=>boolean);
    function mutiCheck(arg:MaterialStatus[]|(()=>boolean)) {
      // TODO: 这里不做4ddat校验,否则需要调多次detail接口确认
      if (!state.rows.length) return false;
      const isAllPass = state.rows.every(row => {
        let isPass = true;
        if (typeof arg === 'function') {
          isPass = arg();
        } else {
          isPass = arg.includes(row.tag);
        }
        return isPass;
      });

      return isAllPass;
    }
    const user = computed(() => getContextUser());


    const mutiShare = async (_rows:MaterialListItem[] = state.rows) => {
      const obj = _rows.find(item => user?.value?.id !== item.creator && item.isAgain === 0);
      if (obj) {
        ElMessage.error('存在不可被分享材料，请重新选择');
        return;
      }
      await dialog({
        is: Share,
        props: {
          materials: _rows,
          showConfig: true,
        },
      }, {
        noTitle: true,
        props: {
          width: '705px',
        },
      });
    };
    const share = async (row:MaterialListItem) => {
      await mutiShare([row]);
    };

    const detail = async (row:MaterialListItem) => {
      await dialog({
        is: MaterialDetailComp,
        props: {
          row,
        },
      });
    };

    const mutiCancelCollect = async (_rows:MaterialListItem[] = state.rows) => {
      await confirm({ title: '是否确定取消收藏？' });
      await api.cancelCollectMaterial(_rows.map(row => row.catalogId));
      loadTable();
    };

    const cancelCollect = async (row:MaterialListItem) => {
      await mutiCancelCollect([row]);
    };
    const viewer = async (row:MaterialListItem) => {
      await dialog({
        is: MaterialViewer,
        props: {
          catalogId: row.catalogId,
        },
      });
    };
    const handleSelection = (_rows:MaterialListItem[]) => {
      state.rows = _rows;
    };
    const applySample = async (_row: MaterialListItem) => {
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

      loadTable();
    };
    const handleCommand = async (command:Command, row:MaterialListItem) => {
      switch (command) {
        case 'viewer':
          await viewer(row);
          break;
        case 'applySample':
          applySample(row);

          break;
        default:
          break;
      }
    };

    // const handleCascaderChange = (categoryIds:string[]) => {
    //   const categoryId = categoryIds?.[2] || categoryIds?.[1] || '';
    //   state.params.fields.categoryId = categoryId ? [categoryId] : [];
    //   searchTable();
    // };

    // const parseApplicableProduct = (value?:string[][]) => {
    //   if (!value) return '--';
    //   return value.map(strArr => strArr.join('/')).join();
    // };

    const parseApplicableProduct = (value?:string[]) => {
      if (!value) return '--';
      return value.join();
    };

    // const handleParams = (params:Obj) => {
    //   delete params.categoryId;
    // };
    const getMaterialList = (params) => {
      Object.entries(params.fields).forEach(([key, val]) => {
        if (!val) {
          delete params.fields[key];
        }
      });
      return api.fetchCollectList(params);
    };

    const saveSearchFormParams = (currentParams: {[key: string]: any}) => {
      const { keywords, ...otherParams } = currentParams;
      state.params = { ...state.params, keywords, ...{ fields: { ...state.params.fields, ...otherParams } } };
    };

    return () => (
      <div class="collect">
        <SdTable
          ref={tableVm}
          title="收藏夹"
          params={state.params}
          fetchTable={getMaterialList}
          showRowId
          columns={columns}
          // form={form}
          onSelection={(_rows:MaterialListItem[]) => handleSelection(_rows)}
          tool={{
            width: isBuyer.value ? 220 : 180,
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
                handleChange={(currentParams: {[key: string]: any}) => {
                  saveSearchFormParams(currentParams);
                  searchFn();
                }}
              ></CollapseSearchFilter>
            ),
            btns: () => {
              const getBtnClass = (passStatus?:MaterialStatus[]) => {
                return classnames(['text-link', { 'h-disabled': passStatus ? !mutiCheck(passStatus) : !mutiCheck(() => !!state.rows.length) }]);
              };
              const getShareBtnClass = () => {
                return classnames(['text-link', { 'h-disabled': !mutiCheck(() => !!state.rows.length) || !checkShare(state.rows) }]);
              };
              return (
                <div>
                  <span class={getShareBtnClass()} onClick={() => mutiShare()}>分享</span>
                  <el-divider direction="vertical"></el-divider>
                  <span class={getBtnClass()} onClick={() => mutiCancelCollect()}>取消收藏</span>
                </div>
              );
            },
            tool: ({ row }:{row:MaterialListItem}) => (
              <div>
                <span class="text-link" onClick={() => detail(row)}>查看</span>
                <el-divider direction="vertical"></el-divider>
                <span class="text-link" onClick={() => cancelCollect(row)}>取消收藏</span>
                <el-divider direction="vertical"></el-divider>
                <span class="text-link" onClick={() => share(row)}>分享</span>
                {isBuyer.value && (
                  <>
                    <el-divider direction="vertical"></el-divider>
                    <el-dropdown trigger="click" onCommand={(command:Command) => handleCommand(command, row)} v-slots={{
                      dropdown: () => (
                        <el-dropdown-menu>
                          <el-dropdown-item command="applySample">申请样品</el-dropdown-item>
                          <el-dropdown-item command="viewer">3D预览</el-dropdown-item>
                        </el-dropdown-menu>
                      ),
                    }}>
                      <span class="text-link">更多</span>

                    </el-dropdown>
                  </>
                )}
              </div>
            ),
            imgUrl: ({ row }:{row:MaterialListItem}) => {
              return (
                <div class="table-img">
                  <base-image src={getMaterialImg(row)} ></base-image>
                </div>
              );
            },
            tag: ({ row }:{row:MaterialListItem}) => {
              const color = statusColorMap[row.tag];
              return <span class={color}>{row.tag}</span>;
            },
            isAgain: ({ row }:{row:MaterialListItem}) => {
              row.isAgainText = row.isAgain === 0 ? '不可分享' : '允许分享';
              return row.isAgainText;
            },
            colorInfo: ({ row }:{row:MaterialListItem}) => {
              const colors = row.renderingInfo.slice(0, 3);
              const showColor = row.renderingInfo.find(color => color.isDefault) || colors[0] || {};
              const TextSpan = (color:GetArrayItem<typeof colors>) => {
                return <span class="color-cell">
                  <span class="color-name">{color.name}</span>
                  <span class="color-family">/{color.colorFamily}</span>
                </span>;
              };
              return <el-dropdown class="color-info-dropdown-table" trigger="click" v-slots={{
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

              </el-dropdown>;
            },
            applicableProduct: ({ row }:{row:MaterialListItem}) => {
              return <span>{parseApplicableProduct(tryParseJson(row.applicableProduct)) }</span>;
            },
          }}>

        </SdTable>
      </div>
    );
  },
});
