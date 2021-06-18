<template>
  <h3>公司信息</h3>
  <el-form
    class="split-columns-form flex-wrap"
    :model="companyInfo"
    :rules="formRules"
    size="small"
    label-position="top"
    ref="formRef"
  >
    <el-form-item label="公司全称" prop="name">
      <el-input
        v-model="companyInfo.name"
        placeholder="请输入公司全称"
        @change="handleFormChange('name', $event)"
      ></el-input>
    </el-form-item>
    <el-form-item label="经营模式" prop="businessModel">
      <DictionarySelect
        type="businessModel"
        :modelValue="companyInfo.businessModel"
        clearable
        placeholder="请输入经营模式"
        @change="handleFormChange('businessModel', $event)"
      ></DictionarySelect>
    </el-form-item>
    <el-form-item label="公司简介" prop="industry">
      <el-input
        type="textarea"
        v-model="companyInfo.industry"
        placeholder="请输入公司简介"
        resize="none"
        rows="3"
        maxlength="500"
        show-word-limit
        @change="handleFormChange('industry', $event)"
      ></el-input>
    </el-form-item>
    <el-form-item label="经营范围" prop="businessScope">
      <el-input
        type="textarea"
        v-model="companyInfo.businessScope"
        placeholder="请输入经营范围"
        resize="none"
        rows="3"
        maxlength="500"
        show-word-limit
        @change="handleFormChange('businessScope', $event)"
      ></el-input>
    </el-form-item>
    <el-form-item label="主营产品" prop="leadingProduct">
      <DictionarySelect
        type="leadingProduct"
        :modelValue="companyInfo.leadingProduct"
        clearable
        :multiple="true"
        placeholder="请选择主营产品"
        @change="handleFormChange('leadingProduct', $event)"
      ></DictionarySelect>
    </el-form-item>

    <el-form-item label="所在地" prop="addressCity">
      <!-- <AddressCascader :value="addressList" @change="handleAddressChange"></AddressCascader> -->
      <DictionaryAddressSelector :modelValue="addressList" @change="handleAddressChange"></DictionaryAddressSelector>
    </el-form-item>
    <el-form-item label="合作品牌" prop="cooperationBrand">
      <el-input
        type="textarea"
        v-model="companyInfo.cooperationBrand"
        placeholder="请输入合作品牌"
        resize="none"
        rows="3"
        maxlength="500"
        show-word-limit
        @change="handleFormChange('cooperationBrand', $event)"
      ></el-input>
    </el-form-item>
    <el-form-item label="详细地址" prop="address">
      <el-input
        type="textarea"
        v-model="companyInfo.address"
        placeholder="请输入详细地址"
        resize="none"
        rows="3"
        maxlength="500"
        show-word-limit
        @change="handleFormChange('address', $event)"
      ></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="creatorPhone">
      <el-input
        v-model="companyInfo.creatorPhone"
        placeholder="请输入手机"
        @change="handleFormChange('creatorPhone', $event)"
      ></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="creatorMail">
      <el-input
        v-model="companyInfo.creatorMail"
        placeholder="请输入邮箱"
        @change="handleFormChange('creatorMail', $event)"
      ></el-input>
    </el-form-item>
    <el-form-item label="联系人" prop="creatorName">
      <el-input
        v-model="companyInfo.creatorName"
        placeholder="请输入联系人"
        :maxlength="32"
        @change="handleFormChange('creatorName', $event)"
      ></el-input>
    </el-form-item>
    <el-form-item label="固定电话" prop="landline">
      <el-input
        v-model="companyInfo.landline"
        placeholder="请输入固定电话"
        @change="handleFormChange('landline', $event)"
      ></el-input>
    </el-form-item>
    <LogoUploader :logoUrl="companyInfo.logo" @upload="handleFormChange('logo', $event)"></LogoUploader>
  </el-form>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, ref,
} from 'vue';
import { ElForm } from 'element-plus';
import DictionarySelect from '@/components/form/DictionarySelect.vue';
import DictionaryAddressSelector from '@/components/form/DictionaryAddressSelector.vue';
import { fetchUserCompany, updateUserCompanyInfo } from '@/api/account';
import { Company } from '@/models/Context';
import validWhitespace from '@/utils/validators/valid-white-space';
import strLength from '@/utils/validators/str-length';
import { validator2ElemRules } from '@/utils/validators/utils/validator-to-elem-rule';
import validMobilePhone from '@/utils/validators/valid-mobile-phone';
import validPhone from '@/utils/validators/valid-phone';
import validEmail from '@/utils/validators/valid-email';
// import AddressCascader from '@/components/form/cascader/AddressCascader.vue';
import { getContextUser, updateContextUser } from '@/loaders/context';
import onCreated from '@/utils/vue/onCreated';
import LogoUploader from './LogoUploader.vue';

type AddressList = [string | null, string | null, string | null];

export default defineComponent({
  name: 'company-info-form',
  components: {
    LogoUploader,
    DictionarySelect,
    // AddressCascader,
    DictionaryAddressSelector,
  },
  emits: ['update'],
  setup() {
    const formRef = ref<InstanceType<typeof ElForm>>();
    const formRules = {
      name: validator2ElemRules([validWhitespace, (value: string) => strLength(value, { max: 64 })], { trigger: 'blur' }),
      industry: validator2ElemRules([validWhitespace], { trigger: 'blur' }),
      businessScope: validator2ElemRules([validWhitespace], { trigger: 'blur' }),
      // city: [
      //   validator.spaceTrim(),
      //   validator.charLengthMax(64),
      // ],
      cooperationBrand: validator2ElemRules([validWhitespace], { trigger: 'blur' }),
      address: validator2ElemRules([validWhitespace], { trigger: 'blur' }),
      creatorPhone: validator2ElemRules([validWhitespace, validMobilePhone], { trigger: 'blur' }),
      creatorMail: validator2ElemRules([validWhitespace, validEmail], { trigger: 'blur' }),
      creatorName: validator2ElemRules([validWhitespace], { trigger: 'blur' }),
      landline: validator2ElemRules([validWhitespace, validPhone], { trigger: 'blur' }),
    };
    const state = reactive({
      companyInfo: {
        id: '',
        name: '',
        logo: '',
        businessModel: '',
        industry: '',
        businessScope: '',
        leadingProduct: '',
        addressCountry: null,
        addressProvince: null,
        addressCity: null,
        cooperationBrand: '',
        address: '',
        creatorPhone: '',
        creatorMail: '',
        creatorName: '',
        landline: '',
        type: 0,
      } as Company,
      addressList: [null, null, null] as AddressList,
    });

    const handleFormChange = (field: keyof typeof state.companyInfo, value: valueof<typeof state.companyInfo>) => {
      formRef.value!.validateField(field, async (errMsg) => {
        if (errMsg) {
          return errMsg;
        }
        // 用于多选框，如主营产品
        if (Array.isArray(value)) {
          value = value.join(',');
        }
        await updateUserCompanyInfo({
          [field]: value,
          id: state.companyInfo.id,
        });
        if (field === 'name') {
          await updateContextUser({ companyName: value });
        }
        return true;
      });
    };
    const getCompanyInfo = async () => {
      const res = await fetchUserCompany();
      res.leadingProduct = res.leadingProduct ? (res.leadingProduct as string).split(',') : [];
      state.companyInfo = res;
      state.addressList = [state.companyInfo.addressCountry, state.companyInfo.addressProvince, state.companyInfo.addressCity];
    };
    onCreated(() => getCompanyInfo());

    const handleAddressChange = async ([addressCountry, addressProvince, addressCity]: AddressList) => {
      await updateUserCompanyInfo({
        id: state.companyInfo.id,
        addressCountry,
        addressProvince,
        addressCity,
      });
      state.addressList = [addressCountry, addressProvince, addressCity];
    };

    return {
      ...toRefs(state),
      formRef,
      formRules,
      handleFormChange,
      handleAddressChange,
    };
  },

});
</script>

<style lang="scss" scoped>
h3 {
  font-weight: 600;
  margin-bottom: 20px;
}

.split-columns-form {
  margin-left: -15px;
  margin-right: -15px;

  .el-form-item {
    width: 50%;
    padding: 0 15px;

    /deep/ .el-form-item__label {
      line-height: 28px;
      padding-bottom: 0;
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>
