import {
  defineComponent, reactive, render, createApp, ref,
  computed,
} from 'vue';
import SdTable from '@/components/sd-table/index';
import './index.scss';
import { dialog, confirm } from '@/utils/vue/dialog';
import MaterialUploadComp from '@/pages/components/material/upload/index.vue';
import MaterialEditComp from '@/pages/components/material/edit/index.vue';
import MaterialDetailComp from '@/pages/components/material/detail/index.vue';
import MaterialViewer from '@/pages/components/material/viewer/index.vue';
import { FormItems, Options } from '@/components/form/HForm/type';
import { fetchMaterial, fetchMaterialList } from '@/api/material';
import {
  MaterialStatus, materialStatus, materialStatusOptions, MaterialListItem, MaterialList,
} from '@/models/Material';
import CategoryCascader from '@/components/form/cascader/CategoryCascader.vue';
import classnames from 'classnames';
import * as api from '@/api/material';
import * as accountApi from '@/api/account';

import { untilLoaded } from '@/utils/open-window';
import tryParseJson from '@4dst-saas/public-utils/dist/try-parse-json';
import Share from '@/pages/components/share/index.vue';
import { getContextUser, updateContextUser } from '@/loaders/context';
import AppError from '@/utils/error';
import { fetchUserAuditStatus } from '@/api/account';
import onCreated from '@/utils/vue/onCreated';
import CollapseSearchFilter from '@/components/CollapseSearchFilter';
import { checkShare } from '@/pages/components/util';
import { getMaterialImg } from '@/pages/components/material/utils';
import History from './components/History.vue';
import SupplyInfo from './components/SupplyInfo.vue';
import SupplyCompanyInfo from './components/SupplyCompanyInfo.vue';
import MultyPrintMaterialLabel from './components/MultyPrintMaterialLabel.vue';
import PrintTagLayoutCtor from './components/PrintTagLayout.vue';

type Command = 'viewer'|'printQrcode'|'history'|'share'|'del';

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
}, {
  key: 'tag',
  title: '材料状态',
},
{
  key: 'isAgain',
  title: '被分享权限',
},
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


// const form:FormItems = [
//   {
//     key: 'keywords',
//     title: '',
//     placeholder: '输入关键词',
//     prefixIcon: 'el-icon-search',
//     formItemProps: {
//       style: {
//         width: '220px',
//       },
//     },
//   },
//   {
//     key: 'categoryId',
//     title: '',
//     type: 'select',
//     value: '',
//     collapsed: true,
//     options: [{
//       key: '',
//       title: '全部材料类型',
//     }],
//   },
//   {
//     key: 'tag',
//     title: '',
//     type: 'select',
//     value: '',
//     collapsed: true,
//     options: [{
//       key: '',
//       title: '全部材料状态',
//     }, ...materialStatusOptions as Options],
//   },
//   {
//     key: 'applicableProduct',
//     title: '',
//     type: 'select',
//     value: '',
//     collapsed: true,
//     options: [{
//       key: '',
//       title: '全部适用产品',
//     }, ...getOptions(searchOptions.applicableProduct2)],
//   },
//   {
//     key: 'colorFamily',
//     title: '',
//     type: 'select',
//     value: '',
//     collapsed: true,
//     options: [{
//       key: '',
//       title: '全部色系',
//     }, ...colorFamilyOptions as Options],
//   },
//   {
//     key: 'isInStock',
//     title: '',
//     type: 'select',
//     value: '',
//     collapsed: true,
//     options: [{
//       key: '',
//       title: '是否现货',
//     }, ...getOptions(searchOptions.isInStock)],
//   },
//   {
//     key: 'textureType',
//     title: '',
//     type: 'select',
//     value: '',
//     collapsed: true,
//     options: [{
//       key: '',
//       title: '全部纹理类型',
//     }, ...getOptions(searchOptions.textureType)],
//   },
//   {
//     key: 'year',
//     title: '',
//     type: 'select',
//     value: '',
//     collapsed: true,
//     options: [{
//       key: '',
//       title: '全部年份',
//     }, ...getOptions(searchOptions.yaer)],
//   },
//   {
//     key: 'tag',
//     title: '',
//     type: 'select',
//     value: '',
//     collapsed: true,
//     options: [{
//       key: '',
//       title: '全部供应商所在地',
//     }],
//   },
// ];

const statusColorMap = {
  待上架: 'green',
  已上架: 'blue',
  已下架: 'gray',
};


export default defineComponent({
  name: 'material-manage',
  components: {},
  props: {},
  setup(props, { emit }) {
    const tableVm = ref<InstanceType<typeof SdTable>>();
    const state = reactive({
      rows: [] as MaterialList,
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

    const loadTable = () => {
      tableVm.value?.load();
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
    // 检查是否有4ddat文件或者云渲染图片
    const singleCheckRender = (row:MaterialListItem) => {
      const hasBanItem = row.renderingInfo.some(item => item.isBan);
      const hasImgInfo = row.renderingInfo.some(item => item.imgInfo && Object.values(item.imgInfo).length);
      return hasBanItem || hasImgInfo;
    };
    const mutiCheckRender = (_rows:MaterialListItem[]) => {
      return _rows.every(row => singleCheckRender(row));
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

    // 检测用户是否需要升级
    const checkUserImprove = async () => {
      const improveConfirm = async () => {
        await confirm({
          title: '升级版试用账号',
          message: '上架材料需要升级为升级版试用账号，您可以点击下方按钮，一键发送申请请求，我们销售同事收到申请后将第一时间联系您，并协助您完成升级的后续事宜！',
          confirmText: '我要升级',
        });
      };
      const improvingConform = async () => {
        await confirm({
          title: '账号正在审核中',
          cancelText: '',
        });
        throw AppError.abort;
      };
      switch (user.value?.status) {
        case 1:
          await dialog({
            is: SupplyInfo,
          });
          await improveConfirm();
          await accountApi.submitImprove();
          await updateContextUser();
          await improvingConform();
          break;
        case 2:
          await improveConfirm();
          await accountApi.submitImprove();
          await updateContextUser();
          await improvingConform();
          break;
        case 3:
          await improvingConform();
          break;

        default:
          break;
      }
    };
    // 检测用户公司全称是否有值
    const checkUserCompanyName = async () => {
      if (!user.value?.companyName) {
        await dialog({
          is: SupplyCompanyInfo,
        });
      }
    };
    const mutiUp = async (_rows:MaterialListItem[] = state.rows) => {
      await confirm({ title: '是否确定上架材料？' });
      await checkUserImprove();
      await api.onMarket(_rows.map(row => row.catalogId));
      loadTable();
    };
    const up = async (row:MaterialListItem) => {
      await mutiUp([row]);
    };
    const mutiDown = async (_rows:MaterialListItem[] = state.rows) => {
      await confirm({ title: '是否确定下架材料？' });
      await api.downMarket(_rows.map(row => row.catalogId));
      loadTable();
    };
    const down = async (row:MaterialListItem) => {
      await mutiDown([row]);
    };

    const mutiDel = async (_rows:MaterialListItem[] = state.rows) => {
      await confirm({ title: '是否确定删除材料？' });
      await api.delMaterial(_rows.map(row => row.catalogId));
      loadTable();
    };
    const del = async (row:MaterialListItem) => {
      await mutiDel([row]);
    };
    const mutiShare = async (_rows:MaterialListItem[] = state.rows) => {
      await checkUserCompanyName();
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

    // 缓存类别映射对象，避免重复请求
    const cacheCategoryMap: {[id: string]: string} = {};
    // 构建材料类别文本格式
    // const formatMaterialTypeContent = (categoryList: api.Category) => {
    //   let res = '';
    //   if (categoryList?.length) {
    //     categoryList.forEach((info, index) => {
    //       if (info.name) res += `${info.name}${index === categoryList.length - 1 ? '' : '/'}`;
    //     });
    //   }
    //   return res;
    // };
    // 获取材料类别数组
    // const getBelongCategoryList = async (categoryId: string) => {
    //   if (cacheCategoryMap[categoryId]) {
    //     return cacheCategoryMap[categoryId];
    //   }
    //   cacheCategoryMap[categoryId] = await api.fetchCategoryList(categoryId);
    //   return cacheCategoryMap[categoryId];
    // };
    // 合并材料类别文本到打印数组中
    const assignMaterialTypeContent = async (_rows:MaterialListItem[]) => {
      for (let i = 0; i < _rows.length; i++) {
        const row = _rows[i];
        if (!cacheCategoryMap[row.categoryId]) {
          const categoryInfo = (await api.fetchCategory(row.categoryId)).data;
          cacheCategoryMap[row.categoryId] = categoryInfo?.name;
        }
        row.materialTypeContent = cacheCategoryMap[row.categoryId];
        if (!row.supplierName) {
          row.supplierName = user.value?.companyName;
        }
      }
    };

    const mutiPrintQrcode = async (_rows:MaterialListItem[] = state.rows) => {
      await checkUserCompanyName();
      await assignMaterialTypeContent(_rows);
      const iframe = document.createElement('iframe');
      // iframe.style.opacity = '0';
      iframe.style.position = 'absolute';
      // iframe.style.width = '300pt';
      // iframe.style.height = '150pt';
      document.body.appendChild(iframe);
      const win = iframe.contentWindow!;
      await untilLoaded(win);
      const doc = iframe.contentDocument!;
      const Ctor = createApp(MultyPrintMaterialLabel, {
        materials: _rows,
        layout: PrintTagLayoutCtor,
        ellipsis: true,
        fontSize: '',
        size: {
          width: 80,
          height: 40,
        },
      });
      const div = doc.createElement('div');
      // 1pt = 0.376mm
      div.style.width = '300pt';
      doc.body.appendChild(div);
      const vm = Ctor.mount(div) as InstanceType<typeof MultyPrintMaterialLabel>;
      vm._document = doc;
      await vm.ready();
      win.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    };
    const printQrcode = async (row:MaterialListItem) => {
      await checkUserCompanyName();
      await mutiPrintQrcode([row]);
    };

    const edit = async (row:MaterialListItem) => {
      await dialog({
        is: MaterialEditComp,
        props: {
          material: row,
        },
      });
      loadTable();
    };
    const detail = async (row:MaterialListItem) => {
      await dialog({
        is: MaterialDetailComp,
        props: {
          row,
        },
      });
    };
    const viewer = async (row:MaterialListItem) => {
      await dialog({
        is: MaterialViewer,
        props: {
          catalogId: row.catalogId,
        },
      });
    };
    // Test
    // viewer();
    const history = async (row:MaterialListItem) => {
      await dialog({
        is: History,
        props: {
          material: row,
        },
      });
    };
    const handleSelection = (_rows:MaterialListItem[]) => {
      state.rows = _rows;
    };
    const handleCommand = async (command:Command, row:MaterialListItem) => {
      switch (command) {
        case 'viewer':
          await viewer(row);
          break;
        case 'printQrcode':
          await printQrcode(row);
          break;
        case 'history':
          await history(row);
          break;
        case 'share':
          await share(row);
          break;
        case 'del':
          await del(row);
          break;
        default:
          break;
      }
    };


    // const handleCascaderChange = (catergorys:string[]) => {
    //   const categoryId = catergorys?.[2] || catergorys?.[1] || '';
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
    //   if (params.fields) params.fields.tag = params.tag;
    //   delete params.tag;
    //   delete params.categoryId;
    // };
    const getMaterialList = (params: {[key: string]: any}) => {
      Object.entries(params.fields).forEach(([key, val]) => {
        if (!val) {
          delete params.fields[key];
        }
      });
      return fetchMaterialList(params);
    };
    // 将搜索参数保存到state.params,以便传入sd-table的params,使调用searchFn时入参正确
    const saveSearchFormParams = (currentParams: {[key: string]: any}) => {
      const { keywords, ...otherParams } = currentParams;
      state.params = { ...state.params, keywords, ...{ fields: { ...state.params.fields, ...otherParams } } };
    };

    return () => (
      <div class="material-manage">

        <SdTable
          ref={tableVm}
          title="材料管理"
          params={state.params}
          fetchTable={getMaterialList}
          showRowId
          columns={columns}
          // rows={rows}
          // form={form}
          onSelection={(_rows:MaterialListItem[]) => handleSelection(_rows)}
          // handleParams={handleParams}
          // formSlots={{
          //   categoryId: () => (
          //     <CategoryCascader onChange={handleCascaderChange} clearable></CategoryCascader>
          //   ),
          // }}
          v-slots={{
            formItem: ({ searchFn }: { searchFn: () => void }) => (
              <CollapseSearchFilter
                isHomePage={true}
                handleChange={(currentParams: {[key: string]: any}) => {
                  saveSearchFormParams(currentParams);
                  searchFn();
                }}
              ></CollapseSearchFilter>
            ),
            titleContent: () => <el-button type="primary" onClick={uploadMaterial}>上传材料</el-button>,
            btns: () => {
              const getBtnClass = (passStatus?:MaterialStatus[]) => {
                return classnames(['text-link', { 'h-disabled': passStatus ? !mutiCheck(passStatus) : !mutiCheck(() => !!state.rows.length) }]);
              };
              const getShareBtnClass = () => {
                return classnames(['text-link', { 'h-disabled': !mutiCheck(() => !!state.rows.length) || !checkShare(state.rows) }]);
              };
              return (
                <div>
                  <span class={getBtnClass(['待上架', '已下架'])} onClick={() => mutiUp()}>上架</span>
                  <el-divider direction="vertical"></el-divider>
                  <span class={getBtnClass(['已上架'])} onClick={() => mutiDown()}>下架</span>
                  <el-divider direction="vertical"></el-divider>
                  <span class={getBtnClass()} onClick={() => mutiDel()}>删除</span>
                  <el-divider direction="vertical"></el-divider>
                  <span class={getShareBtnClass()} onClick={() => mutiShare()}>分享</span>
                  <el-divider direction="vertical"></el-divider>
                  <span class={getBtnClass()} onClick={() => mutiPrintQrcode()}>打印二维码</span>
                </div>
              );
            },
            tool: ({ row }:{row:MaterialListItem}) => (
              <div>
                <span class="text-link" onClick={() => detail(row)}>查看</span>
                <el-divider direction="vertical"></el-divider>
                <span class="text-link" onClick={() => edit(row)}>编辑</span>
                <el-divider direction="vertical"></el-divider>
                {
                  row.tag === '已上架'
                    ? <span class="text-link" onClick={() => down(row)}>下架</span>
                    : <span class="text-link" onClick={() => up(row)}>上架</span>
                }
                <el-divider direction="vertical"></el-divider>

                <el-dropdown trigger="click" onCommand={(command:Command) => handleCommand(command, row)} v-slots={{
                  dropdown: () => (
                    <el-dropdown-menu>
                      <el-dropdown-item command="viewer">3D预览</el-dropdown-item>
                      <el-dropdown-item command="printQrcode">打印二维码</el-dropdown-item>
                      <el-dropdown-item command="history">历史版本</el-dropdown-item>
                      <el-dropdown-item command="share">分享</el-dropdown-item>
                      <el-dropdown-item command="del">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  ),
                }}>
                  <span class="text-link">更多</span>

                </el-dropdown>
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
            // season: ({ row }:{row:MaterialListItem}) => {
            //   return <span>{row.season.join()}</span>;
            // },
            // applicableProduct: ({ row }:{row:MaterialListItem}) => {
            //   return <span>{row.applicableProduct.join()}</span>;
            // },
            // surfaceTechnology: ({ row }:{row:MaterialListItem}) => {
            //   return <span>{Array.isArray(row.surfaceTechnology) ? row.surfaceTechnology.join() : row.surfaceTechnology}</span>;
            // },
            // materialtechnology: ({ row }:{row:MaterialListItem}) => {
            //   return <span>{row.materialtechnology.join()}</span>;
            // },
            colorInfo: ({ row }:{row:MaterialListItem}) => {
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
            applicableProduct: ({ row }:{row:MaterialListItem}) => {
              return <span>{parseApplicableProduct(tryParseJson(row.applicableProduct)) }</span>;
            },
          }}>

        </SdTable>
      </div>
    );
  },
});
