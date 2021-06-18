import {
  getCurrentInstance, SetupContext,
} from 'vue';

const useFormCheck = ({ root, refs }: SetupContext) => {
  const validate = (form: string) => {
    let pass;
    const comp = refs[form];

    if (comp.validate) {
      comp.validate();
    } else {
      comp.validate((valid: boolean) => {
        pass = valid;
      });
    }
    return pass;
  };

  const clearValidate = async (form: string) => {
    // 必须使用nextTick保证在弹窗出现后执行
    await root.$nextTick();
    const comp = refs[form];
    if (!comp) return;
    if (comp.clearValidate) {
      comp.clearValidate();
    } else {
      comp.clearValidate();
    }
  };

  return {
    validate,
    clearValidate,
  };
};

export default useFormCheck;
