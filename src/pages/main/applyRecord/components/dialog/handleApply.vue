<template>
  <div class="refuse-apply">
    <div class="main">
      <div class="dialog-title">{{ title }}</div>
      <el-form
        class="form-box flex-wrap"
        :model="form"
        :rules="formRules"
        size="small"
        label-position="top"
        ref="formRef"
      >
        <el-form-item label="" prop="content">
          <el-input
            type="textarea"
            v-model="form.content"
            :placeholder="placeholder"
            resize="none"
            rows="5"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button type="primary" @click="submit()">提 交</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import {
  defineComponent, reactive, toRefs, ref, PropType,
} from '@vue/runtime-core';
import { ElForm, ElMessage } from 'element-plus';
import { validator2ElemRules } from '@/utils/validators/utils/validator-to-elem-rule';
import validFilled from '@/utils/validators/valid-filled';
import {
  handlerApply, submitApply,
} from '@/api/applyRecord';
import { getContextUser } from '@/loaders/context';


export default defineComponent({
  name: '',

  components: {
  },
  props: {
    placeholder: {
      type: String,
    },
    title: {
      type: String,
    },
    submitType: {
      type: String as PropType<'refuse' | 'applySample'>, // 需要的自行添加
    },
    appendRequestParams: {
      type: Object as PropType<{
        approver: string,
        applyType: 1 | 2,
        sampleId?: string,
        originalCId?: string,
        sampleName?: string,
        categoryId?: string
      }>,
    },
    refuseParams: {
      type: Object as PropType<{ applyId: string, approvalStatus: number }>,
    },
  },
  emits: ['confirm'],
  dialogify: {
    // noTitle: true,
    props: {
      title: '',
      width: '500px',
      closeOnClickModal: false,
    },
  },
  setup(props, { emit }) {
    const formRef = ref<InstanceType<typeof ElForm>>();

    const formRules = {

      content: validator2ElemRules([validFilled], { trigger: 'blur' }),

    };

    const state = reactive({

      form: {

        content: '',

      },

    });
    const submit = async () => {
      formRef.value!.validate(async (valid) => {
        if (valid) {
          if (props.submitType === 'refuse') {
            await handlerApply({

              ...(props.refuseParams! ?? {}),
              approvalContent: {
                content: state.form.content,
              },
            });
            await ElMessage.success('已拒绝');

            emit('confirm');
          } else if (props.submitType === 'applySample') {
            const user = getContextUser();


            await submitApply({
              applicant: user?.id,
              applyContent: {
                sampleId: props?.appendRequestParams?.sampleId,
                originalCId: props?.appendRequestParams?.originalCId,
                applyContent: state.form.content,
                sampleName: props?.appendRequestParams?.sampleName,
                categoryId: props?.appendRequestParams?.categoryId,

              },
              ...(props.appendRequestParams! ?? {}),
            });
            await ElMessage.success('申请成功');

            emit('confirm');
          }
        } else {
          console.log('error submit!!');
          return false;
        }
        return true;
      });
    };


    return {
      ...toRefs(state), formRules, formRef, submit,
    };
  },
});
</script>
<style lang="scss" scoped>
.refuse-apply {
  .main {
    border-radius: 8px;
    position: relative;
    .dialog-title {
      font-size: 16px;
      position: absolute;
      top: -20px;
    }

    .form-box {
      padding: 22px 6px 14px;
      .el-form-item {
        width: 100%;
        height: 180px;

        /deep/ .el-textarea__inner {
          height: 180px;
        }
        /deep/ .el-form-item__label {
          padding-bottom: 0;
        }
      }
    }
  }
  .footer {
    text-align: right;
  }
}
</style>
