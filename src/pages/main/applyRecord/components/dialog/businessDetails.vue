<template>
  <div class="mineInfo">
    <ul class="pages_mineInfo_index scrollable-y">
      <div class="pages_mine-info flex-space-between">
        <li class="icon-box">
          <img class="imageIcon" :src="userHeadImg" />
        </li>

        <li class="title-box flex-column flex-1">
          <span class="nameM over-text">{{ userName }}</span>
          <span class="phoneM">{{ phone }}</span>
        </li>
      </div>
      <div class="mineInfoList">
        <div class="list">
          <div class="item flex" v-for="(item, index) in applyListC" :key="index">
            <div class="item-left flex-space-between">
              <li class="title-box flex-column">
                <span class="title">{{ item.title }}</span>
              </li>
              <!-- <li v-if="item.icon === 'icon'">
                <image class="icon" src=""> </image>
                <AtIcon class="jiantouImage" value="chevron-right" size="16" color="#cccccc"></AtIcon>
              </li> -->
              <li class="content" v-if="item.icon === ''">
                {{ item.content }}
                <!-- <AtIcon class="jiantouR" value="chevron-right" size="16" color="#cccccc"></AtIcon> -->
              </li>
              <li class="contentJJ" v-if="item.icon === 'gsjj'">
                {{ item.content }}
                <!-- <AtIcon class="jiantouR" value="chevron-right" size="16" color="#cccccc"></AtIcon> -->
              </li>
              <li class="contentPhone" v-if="item.icon === 'phone'">
                {{ item.content }}
              </li>
            </div>
          </div>
        </div>
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed, onMounted,
} from 'vue';
import { getContextUser } from '@/loaders/context';
// import { companyInfo, fetchUserCompanyID } from '../../api/mine';
// import * as api from '@/api/mine';
import axios from '@/utils/axios';
import { User } from '@/models/Context';
import { getDictionaryByTypeCode } from '@/api/dictionary';
import { getMatchedAddressCnText } from '@/utils/format-address';

export interface companyInfo {
  addressProvince: string; // 级联省份
  country: string; // 国家id
  cooperationBrand: string; // 合作品牌
  city: string; // 城市id
  businessModel: number; // 经营模式：制造商、工厂；贸易公司；批发零售；其他//  走字典
  leadingProduct: string; // 主营产品：皮料；人造革；针织；梭织；薄膜料；其他；鞋带；织带；织唛；鞋垫；沿条；五金配饰；线；鞋底//  走字典
  creatorId: string; // 创建人 Id
  creatorName: string; // 创建人名称
  scale: number; // 1：少于50人 2；50-150人 3：150-500人 4：500-1000人 5：1000-5000人 6：5000人以上
  industry: string; // 公司简介
  creatorPosition: string; // 创建人职位
  type: number; // 1：Brand；2：Agent/Trading Company；3：Material Supplier；4：Manufacturer；5：Independent Designer；
  creatorPhone: string; // 创建人联系方式
  logo: string; // logo
  id: string; // 公司id
  creatorMail: string; // 创建人邮箱
  addressCity: string; // 级联城市
  addressCountry: string; // 级联国家
  creatorLastName: string; // LastName
  address: string; // 公司详细地址
  businessScope: string; // 经营范围
  abbreviation: string; // 公司简称
  creatorFirstName: string; // FirstName
  name: string; // 公司名称
  landline: string; // 固定电话
  addressDistrict: string; // 级联地区
  businessType: number; // 业务线：0-通用；1-安踏；
  message: string;
}

// 根据 ID 获取所以公司的信息
export const fetchUserCompanyID = async (companyID: string) => {
  const res = (
    await axios.get<companyInfo>('/authcenter/company/get/info/id', {
      params: {
        id: companyID,
      },
    })
  ).data;
  return res;
};

// 根据 token 获取所以公司的信息
export const fetchUserCompany = async () => {
  const res = (
    await axios.get<companyInfo>('/authcenter/company/get/info', {
      params: {
        // token: tokenUtils.get(),
      },
    })
  ).data;
  return res;
};

export default defineComponent({
  name: 'mineInfoList',
  dialogify: {
    props: {
      title: '',
      width: '436px',
      closeOnClickModal: false,
    },
  },
  components: {},
  props: {
    supplierId: String,
  },

  setup(props) {
    const userInfo = computed(() => getContextUser() as User);

    const state = reactive({
      userName: '',
      phone: '',
      options: [] as { key: number; title: string }[],
      companyInfoData: {} as companyInfo,
      applyListP: [
        // { title: '用户名', icon: '', content: userInfo.value?.name },
        // { title: '所属部门', icon: '', content: userInfo.value?.department },
        { title: '用户名', icon: '', content: userInfo.value?.name },
        { title: '所属部门', icon: '', content: userInfo.value?.department },
      ],
      applyListC: {
        0: {
          title: '公司全称',
          icon: '',
          content: '',
          maxlength: 64,
        },
        1: {
          title: '公司简介',
          icon: '',
          content: '',
          maxlength: 500,
        },
        // '2':{ title: '公司logo', icon: 'icon', content: '' },
        3: { title: '经营模式', icon: '', content: '' },
        4: { title: '主营产品', icon: '', content: '' },
        5: {
          title: '合作品牌',
          icon: '',
          content: '',
          maxlength: 500,
        },
        6: { title: '所在地', icon: '', content: '' },
        7: {
          title: '手机',
          icon: '',
          content: '',
          maxlength: 11,
        },
        8: { title: '邮箱', icon: '', content: '' },
        9: {
          title: '详细地址',
          icon: '',
          content: '',
          maxlength: 500,
        },
        10: {
          title: '联系人',
          icon: '',
          content: '',
          maxlength: 32,
        },
        11: {
          title: '固定电话',
          icon: '',
          content: '',
          maxlength: 30,
        },
      },
      selector: ['制造商', '工厂', '贸易公司', '批发零售', '其他'],
    });

    const getUserInfo = async () => {
      const res = await fetchUserCompany();
      state.phone = res.creatorPhone;
      const reg = /^(\d{3})\d{4}(\d{4})$/;
      state.phone = state.phone.replace(reg, '$1****$2');
      console.log(`电话号码${state.phone}`);
    };

    const getOptionsList = async () => {
      const res = await getDictionaryByTypeCode('leadingProduct');
      state.options = res.data.map(item => ({ key: String(item.itemValue), title: item.label }));
    };
    // getOptionsList();

    getUserInfo();


    // const userHeadImg = computed(() => {
    //   return userInfo.value?.headImg || require("@/assets/img/public/fail.png");
    // });
    const userHeadImg = computed(
      () => userInfo.value?.headImg
        || require('@/assets/img/header/default_avatar.png'),
    );
    console.log(userHeadImg.value);
    const getAdress = async (
      countryId: string,
      provinceId: string,
      id: string,
    ) => {
      console.log(countryId + provinceId + id);
      const text = await getMatchedAddressCnText([countryId, provinceId, id]);
      // const text = 'z';
      console.log(`$$$$${text}`);
      return text;
    };

    const getAdress6 = async () => {
      state.applyListC[6].content = await getAdress(
        state.companyInfoData.addressCountry,
        state.companyInfoData.addressProvince,
        state.companyInfoData.addressCity,
      );
      console.log(state.applyListC[6].content);
    };
    const initCompanyInfo = () => {
      state.applyListP[0].content = userInfo.value?.name;
      state.applyListP[1].content = userInfo.value?.department;
      state.applyListC[0].content = state.companyInfoData.name;
      state.applyListC[1].content = state.companyInfoData.industry;
      state.applyListC[3].content = state.selector[state.companyInfoData.businessModel];

      if (state.companyInfoData.leadingProduct) {
        // console.log(state.companyInfoData.leadingProduct);
        const ids = state.companyInfoData.leadingProduct.split(',');
        console.log(ids);
        state.applyListC[4].content = '';
        ids.forEach((id, i) => {
          // state.mainRunId += id + (i < ids.length - 1 ? ',' : '');
          const matchItem = state.options.find(
            (item) => item.key.toString() === id,
          );
          console.log(matchItem, id);
          if (matchItem) {
            state.applyListC[4].content
              += matchItem.title + (i < ids.length - 1 ? '/' : '');
          }
        });
      } else {
        state.applyListC[4].content = '无';
      }
      state.applyListC[5].content = state.companyInfoData.cooperationBrand;
      getAdress6();
      let tel = state.companyInfoData.creatorPhone;
      const reg = /^(\d{3})\d{4}(\d{4})$/;
      tel = tel.replace(reg, '$1****$2');

      state.applyListC[7].content = tel;
      state.applyListC[8].content = state.companyInfoData.creatorMail;
      state.applyListC[9].content = state.companyInfoData.address;
      state.applyListC[10].content = state.companyInfoData.creatorName;
      state.applyListC[11].content = state.companyInfoData.landline;

      // console.log(state.companyInfoData);
    };
    // 获取公司信息
    const getCompanyInfo = async () => {
      const res = await fetchUserCompanyID(
        !(props.supplierId as string)
          ? (userInfo.value?.companyId as string)
          : (props.supplierId as string),
      );
      state.userName = userInfo.value.name;
      state.companyInfoData = res;
      console.log('@@@@@getCompanyInfo');
    };
    // initCompanyInfo();
    // getCompanyInfo();

    // onMounted(() => {
    Promise.all([getCompanyInfo(), getOptionsList()]).then(([info, options]) => {
      initCompanyInfo();
    });
    // });


    return {
      ...toRefs(state),
      userHeadImg,
    };
  },
});
</script>


<style lang="scss" scoped>
.mineInfo {
  margin: auto auto;
  // width: 436px;
  height: 600px;
  background-color: rgb(255, 255, 255);
  .pages_mine-info {
    margin-bottom: 24px;
  }
  .el-dialog_headerbtn {
    // position: absolute;
    margin: 20px 20px 8px 400px;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 16px;
    color: #9ca0a4;
  }
  .pages_mineInfo_index {
    margin: auto auto;
    // width: 405px;
    height: 600px;
    background-color: rgb(255, 255, 255);
  }
  .icon-box {
    // margin-left: 30px;
  }
  .imageIcon {
    // padding: 15px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }
  .title-box {
    // overflow: hidden;
    // margin-right: 110px;
  }

  .nameM {
    margin-left: 8px;
    margin-bottom: 2px;
    height: 25px;
    opacity: 1;
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    color: #222222;
    line-height: 25px;
    letter-spacing: 0px;
  }

  .phoneM {
    margin-left: 8px;
    width: 75px;
    height: 18px;
    opacity: 1;
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 18px;
    letter-spacing: 0px;
  }

  .mineInfoList {
  }
  .title1 {
    padding-top: 12px;
    padding-left: 16px;
    background-color: #f1f2f5;
    width: 100%;
    height: 36px;
    opacity: 1;
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #222222;
    line-height: 12px;
  }
  .title {
    color: #999999;
    // padding-left: 30px;
    width: 56px;
    height: 16px;
    opacity: 1;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    line-height: 16px;
  }
  .icon {
    margin-left: 15px;
    width: 42px;
    height: 42px;
  }
  .content {
    width: 100%;
    margin-left: 24px;
    margin-right: 31px;
    // height: 16px;
    opacity: 1;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #222222;
    line-height: 16px;
  }
  .contentJJ {
    width: 100%;
    margin-left: 24px;
    margin-right: 31px;
    // height: 16px;
    opacity: 1;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #222222;
    line-height: 16px;
    word-break: break-all;
    // text-align-last: left;
  }
  .contentPhone {
    width: 100%;
    margin-left: 24px;
    margin-right: 31px;
    // height: 16px;
    opacity: 1;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #222222;
    line-height: 25px;
  }
  .item-left {
    width: 100%;
    // margin-bottom: 10px;
  }
  .item {
    padding: 18px 0;
    border-bottom: 1px solid #f2f2f2;
  }

  .jiantouImage {
    padding-bottom: 30px;
    margin-right: 12px;
  }
}
</style>
