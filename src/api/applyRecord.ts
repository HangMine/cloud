/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs';
import axios from '@/utils/axios';
import delay from '@4dst-saas/public-utils/dist/delay';

// 我发起的申请列表
export interface ApplyItem {
  id: string,
  applicant: string,
  applyContent: {
    applyContent:string,
    sampleId?:string,
    sampleName?:string,
    categoryId?:string
  },
  applyType:number,
  approvalStatus:number,
  applicantName?: string,
  applicantImg?: string,
  approvalStatusText?: string,
  applyCon?: string,
  gmtCreateTime?: string,
  sampleName?: string,
  sampleId?: string,
  orgId?: string,
}
export interface ApplyParams{
  keywords:string,
  page:number,
  size:number,
  receiveOrlaunch:string,
  fields:{
  },
}
export interface noticeParams{
  keywords:string,
  page:number,
  size:number,
  fields:{
    noticeType?:number
  },
}
export interface noticeItem{
  id:string,
  title:string,
  noticeStatus:number,
  orgId:string,
  noticeType:number, // 1-分享通知，2-账号审核结果，3-材料版本信息变更，4-合作申请结果，5-合作申请结果
  noticeContent:string,
  userId:string, // 归属用户id
  gmtCreateTime:string,
  noticeTypeText?:string,
  createTime?:string,
  noticeRelatedId?:string,
  noticeDetail: [
    {
      key: string,
      name: string,
      content: string,
      keyTitle: string
    }
  ],
}
// 跟据id获取公司信息
export const getComponyInfo = async (id:string | undefined) => {
  const res = (await axios.get('/authcenter/company/get/info/id', { params: { id } })).data;
  return res;
};
// 我发起或者收到的申请列表
export const applyReceiveOrLaunch = async (params:ApplyParams) => {
  let url;
  if (params.receiveOrlaunch === 'send') {
    url = '/om-material/apply/send/search';
  } else if (params.receiveOrlaunch === 'receive') {
    url = '/om-material/apply/receive/search';
  }

  const res = (await axios.post<TableData<ApplyItem>>(url as string, params)).data;
  await res.records.length > 0 && res.records.forEach(async item => {
    item.applyCon = item.applyContent.applyContent;
    item.sampleName = item.applyContent.sampleName;
    item.sampleId = item.applyContent.sampleId;
    item.gmtCreateTime = item.gmtCreateTime?.substr(0, 10);

    switch (item.approvalStatus) {
      case 0:
        item.approvalStatusText = '待审核';
        break;
      case 1:
        item.approvalStatusText = '已通过';
        break;
      case 2:
        item.approvalStatusText = '已拒绝';
        break;
      case 3:
        item.approvalStatusText = '已取消';
        break;
      default:
        break;
    }
    item.applicantName = (await getComponyInfo(item.orgId)).name;
  });
  await delay(50);

  return res;
};
// export const applyRecordLaunch = async (params:ApplyParams) => {
//   const res = (await axios.post<TableData<ApplyItem>>('/om-material/apply/send/search', params)).data;
//   res.records.length > 0 && res.records.forEach(async item => {
//     item.applyCon = item.applyContent.applyContent;
//     item.sampleName = item.applyContent.sampleName;
//     item.sampleId = item.applyContent.sampleId;
//     item.gmtCreateTime = dayjs(item.gmtCreateTime * 1).format('YYYY-MM-DD');

//     switch (item.approvalStatus) {
//       case 0:
//         item.approvalStatusText = '待审核';
//         break;
//       case 1:
//         item.approvalStatusText = '已通过';
//         break;
//       case 2:
//         item.approvalStatusText = '已拒绝';
//         break;
//       case 3:
//         item.approvalStatusText = '已取消';
//         break;
//       default:
//         break;
//     }
//     item.applicantName = (await getComponyInfo(item.orgId)).name;
//   });

//   return res;
// };
// 我收到的申请列表
// export const applyRecordReceive = async (params:ApplyParams) => {
//   const res = (await axios.post<TableData<ApplyItem>>('/om-material/apply/receive/search', params)).data;
//   return res;
// };
// 取消申请
export const applyCancel = async (id:string) => {
  const res = (await axios.get('/om-material/apply/cancel', { params: { id } })).data;
  return res;
};
// 申请详情
export const applyDetail = async (id:string) => {
  const res = (await axios.get('/om-material/apply/info', { params: { id } })).data;
  return res;
};
// 处理申请拒绝申请
export const handlerApply = async (params:{applyId:string, approvalStatus:number, approvalContent:{content:string}}) => {
  const res = await axios.post('/om-material/apply/handle', params);
  return res;
};
// 寄样品
export const sendSample = async (params:{applyId:string, number:string, logisticsNumber:string}) => {
  const res = await axios.post('/om-material/apply/send/sample', params);
  return res;
};
type submitApplyParams = {
  approver: string,
  applyType: 1 | 2, // （1-合作申请，2-样品申请）
  applyContent: {
    sampleId? : string, // 样品申请必填, 合作申请不填
    applyContent: string,
    originalCId?:string,
    sampleName?:string,
    categoryId?:string,
  }
  applicant: string,
};
// 发起合作申请/样品申请
export const submitApply = async (params: submitApplyParams) => {
  const res = (await axios.post<boolean>('/om-material/apply/add', params)).data;
  return res;
};

// 获取通知列表的接口
export const getNoticeList = async (params:noticeParams) => {
  const res = (await axios.post<TableData<noticeItem>>('/om-material/notice/list', params)).data;
  return res;
};
// 读取通知详情
export const getNoticeDetail = async (id:string | undefined) => {
  const res = (await axios.get<noticeItem>('/om-material/notice/info', { params: { id } })).data;
  return res;
};
// 删除通知
export const deleteNotice = async (id:number | undefined) => {
  const res = (await axios.get<null>('/om-material/notice/remove', { params: { id } })).data;
  return res;
};
// 标为已读
export const changeNoticeStatus = async (id:string | undefined) => {
  const res = (await axios.get<null>('/om-material/notice/read', { params: { id } })).data;
  return res;
};
// 删除全部消息接口
export const deleteNoticeAll = async () => {
  const res = (await axios.get<null>('/om-material/notice/all/remove')).data;
  return res;
};
// 根据消息类别删除
export const deleteNoticeByType = async (noticeType:number | undefined) => {
  const res = (await axios.get<null>('/om-material/notice/type/remove', { params: { noticeType } })).data;
  return res;
};


