import {
  reactive, computed, toRefs, getCurrentInstance,
} from 'vue';
import { Obj } from '../type';

const useEditModal = (operate?: Obj) => {
  const that = getCurrentInstance()!;
  const state = reactive({
    isEdit: false,
    editShow: false,
    editParams: {},
    editFormValues: {} as Obj | undefined,
  });
  const editTitle = computed(() => (state.isEdit ? '编辑' : '新增'));

  // 新增
  const add = () => {
    if (operate?.add?.submitUrl) {
      state.isEdit = false;
      state.editShow = true;
      state.editFormValues = undefined;
    } else {
      // 自定义
      that.$emit('add', that);
    }
  };

  // 编辑
  const edit = (row: Obj, index: number) => {
    if (operate?.edit?.submitUrl) {
      state.editFormValues = row;
      state.isEdit = true;
      state.editShow = true;
    } else {
      // 自定义
      that.$emit('edit', row, index);
    }
  };

  // 抛出删除事件
  const del = (row: Obj, index: number) => {
    that.$emit('del', row, index);
  };

  const getOperateTitle = (type: 'add' | 'edit' | 'del') => {
    const titleMap = {
      add: '新增',
      edit: '编辑',
      del: '删除',
    };
    const opeateOption = (operate && operate[type]) || {};
    return opeateOption.title || titleMap[type] || '';
  };

  return {
    ...toRefs(state),
    editTitle,
    add,
    edit,
    del,
    getOperateTitle,
  };
};

export default useEditModal;
