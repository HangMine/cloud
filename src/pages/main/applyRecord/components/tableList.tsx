import {
  defineComponent, onMounted, reactive, ref, watch,
} from 'vue';
import { confirm, dialog } from '@/utils/vue/dialog';
import { FormItems, Options } from '@/components/form/HForm/type';
import HForm from '@/components/form/HForm/index.vue';
import SdTable from '@/components/sd-table/index';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

import * as api from '@/api/applyRecord';
import './tableList.scss';
import usePermisson from '@/utils/uses/use-permisson';
import {
  ApplyItem, applyCancel, handlerApply, applyReceiveOrLaunch,
} from '@/api/applyRecord';
import MaterialDetailComp from '@/pages/components/material/detail/index.vue';
import SendSample from './dialog/sendSample.vue';
import RefuseApply from './dialog/handleApply.vue';
import ApplyContent from './dialog/applyContent.vue';
import BusinessDetails from './dialog/businessDetails.vue';

const columnsAll = [{
  key: 'applicantName',
  title: '申请者',
}, {
  key: 'applyCon',
  title: '申请内容',
  width: 288,

  showOverflowTooltip: false,
}, {
  key: 'sampleName',
  title: '样品名称',


},
{
  key: 'gmtCreateTime',
  title: '申请时间',

},
{
  key: 'approvalStatusText',
  title: '申请状态',

},
];

const form:FormItems = [{
  key: 'approvalStatus',
  title: '',
  multiple: true,
  type: 'select',
  value: '',
  placeholder: '全部状态',
  options: [

    {
      key: 0,
      title: '待审核',

    }, {
      key: 1,
      title: '已通过',

    }, {
      key: 2,
      title: '已拒绝',

    }, {
      key: 3,
      title: '已取消',

    }],
  formItemProps: {
    style: {
      width: '160px',
    },
  },
}, {
  key: 'date',
  title: '',
  type: 'date',
  childType: 'daterange',
  formItemProps: {
    style: {
      width: '220px',
    },
  },
}];
export default defineComponent({
  name: 'supplier-apply-record',
  components: {},
  props: { id: { type: String }, title: { type: String }, applyType: { type: String } },
  setup(props) {
    const { isSupplier, isBuyer } = usePermisson();
    // console.log(usePermisson(), isSupplier.value, isBuyer.value, 'isBuyer');
    const getColumns = () => {
      if (props.applyType === '1') {
        columnsAll.splice(2, 1);
        console.log(columnsAll);
        return columnsAll;
      }
      let columns;
      if (columnsAll[2].key === 'sampleName') {
        columns = columnsAll;
      } else {
        columnsAll.splice(2, 0, {
          key: 'sampleName',
          title: '样品名称',
        });
        columns = columnsAll;
      }

      return columns;
    };

    const tableVm = ref<InstanceType<typeof SdTable>>();

    const state = reactive({
      applyParams: {
        applyId: '',

        approvalStatus: 2,
        approvalContent: {
          content: '',
        },

      },
      rows: [] as ApplyItem[],
      isSample: '1',
      formData: [],
      formParams: {},
      params: {
        receiveOrlaunch: 'send',

        fields: {
          applyBeginTime: '', applyEndTime: '', approvalStatus: [], applyType: props.applyType,
        },

      },
    });
    const loadTable = () => {
      tableVm.value?.load();
    };

    const cancelApply = async (row:ApplyItem) => {
      console.log(row);
      await confirm({ title: '是否确定取消申请？' });
      await applyCancel(row.id);
      ElMessage.success('取消成功');
      loadTable();
    };
    const openComponyDialog = async (row:ApplyItem) => {
      await dialog({
        is: BusinessDetails,
        props: {
          supplierId: row.orgId,
        },
      });
    };
    const openMaterialDialog = async (row:ApplyItem) => {
      await dialog({
        is: MaterialDetailComp,
        props: {
          row: {
            catalogId: row.applyContent?.sampleId,
            categoryId: row.applyContent?.categoryId,

          },

        },
      });
    };

    const openApplyConDialog = async (row:ApplyItem) => {
      await dialog({
        is: ApplyContent,
        props: {
          applyContent: row.applyCon,

        },
      });
    };

    // 同意申请
    const handleAgree = async (row:ApplyItem) => {
      if (props.title === '样品申请') {
        await dialog({
          is: SendSample,
          props: {
            applyId: row.id,
            orgId: row.orgId,
            // catalogId: row.catalogId,
          },
        });
      } else if (props.title === '合作申请') {
        state.applyParams.applyId = row.id;
        state.applyParams.approvalStatus = 1;
        await handlerApply(state.applyParams);
        ElMessage.success('已同意');
      }
      loadTable();
    };
    // 拒绝申请
    const handleRefuse = async (row:ApplyItem) => {
      if (props.title === '样品申请') {
        await dialog({
          is: RefuseApply,
          props: {
            title: '拒绝理由',
            placeholder: '请输入拒绝理由',
            submitType: 'refuse',
            refuseParams: {
              applyId: row.id as string,
              approvalStatus: 2 as number,

            },
            // catalogId: row.catalogId,
          },
        });
      } else if (props.title === '合作申请') {
        state.applyParams.applyId = row.id;
        await handlerApply(state.applyParams);
        ElMessage.success('已拒绝');
      }
      loadTable();
    };

    watch(() => state.isSample, () => {
      state.params.receiveOrlaunch = state.isSample === '1' ? 'send' : 'receive';
      loadTable();
    });
    const getApplyList = (params) => {
      Object.entries(params.fields).forEach(([key, val]) => {
        if (!val) {
          delete params.fields[key];
        }
      });
      const request = applyReceiveOrLaunch;
      return request(params);
    };

    const handleParams = (params:Obj) => {
      console.log(params, 'params');
      if (params.fields) {
        params.fields.applyType = props.applyType === '1' ? 1 : 2;
        params.fields.approvalStatus = params.approvalStatus;
        params.fields.applyBeginTime = (params.date && params.date['0'] && dayjs(params.date['0']).format('YYYY-MM-DD HH:mm:ss')) || '';
        params.fields.applyEndTime = (params.date && params.date['0'] && dayjs(params.date['1']).format('YYYY-MM-DD HH:mm:ss')) || '';
      }

      delete params.date;
      delete params.approvalStatus;
    };
    return () => (

      <div class="apply-record">
        <SdTable
          ref={tableVm}
          title={props.title}
          params={state.params}
          form={form}
          fetchTable={getApplyList}
          columns={getColumns()}

          showRowId
          handleParams={handleParams}
          v-slots={{

            titleContent: () => {
              return isSupplier.value ? (
                <el-tabs v-model={state.isSample} class="apply-tab flex-center">
                  <el-tab-pane label="我发起的" name="1"> </el-tab-pane>
                  <el-tab-pane label="我收到的" name="2"> </el-tab-pane>
                </el-tabs>
              ) : '';
            },

            tool: ({ row }:{row:ApplyItem}) => {
              return !isSupplier.value || state.isSample === '1' ? (
                <div>
                  <span class={ row.approvalStatus !== 0 ? 'gray-color' : 'text-link'}
                    onClick={() => row.approvalStatus === 0 && cancelApply(row)}>取消申请</span>
                </div>
              ) : (
                <div class={ row.approvalStatus !== 0 ? 'gray-color' : 'text-link'}>
                  <span onClick={() => row.approvalStatus === 0 && handleAgree(row)}>同意</span>
                  <el-divider direction="vertical"></el-divider>
                  <span onClick={() => row.approvalStatus === 0 && handleRefuse(row)}>拒绝</span>
                </div>
              );
            },
            applicantName: ({ row }:{row:ApplyItem}) => {
              return <span style="color:#2878FF;cursor:pointer" onClick={() => openComponyDialog(row)}>{row.applicantName || '--'}</span>;
            },
            applyCon: ({ row }:{row:ApplyItem}) => {
              return row.applyCon && row.applyCon.length > 19 ? (<div class="apply-con" onClick={() => openApplyConDialog(row)}>

                <span class="apply-con-text" >
                  {`${row.applyCon.substr(0, 17)}...`}
                </span>
                <i class="iconfont i-r-xia-12 right-iconfont" />
              </div>) : (<div class="apply-con" > <span >{row.applyCon || '--'}</span></div>);
            },

            sampleName: ({ row }:{row:ApplyItem}) => {
              return <span style="color:#2878FF;cursor:pointer" onClick={() => openMaterialDialog(row)}>{row.sampleName || '--'}</span>;
            },
            approvalStatusText: ({ row }:{row:ApplyItem}) => {
              return <span style={{
                color: row.approvalStatusText === '待审核'
                  ? '#2878FF'
                  : row.approvalStatusText === '已通过'
                    ? '#32CC72' : '#999999',
              }} >{row.approvalStatusText}</span>;
            },

          }}>
        </SdTable>
      </div>
    );
  },
});
