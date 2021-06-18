import {
  SetupContext,
} from 'vue';
import { Obj } from '../type';

const useSelection = ({ emit }:SetupContext) => {
  const selectionChange = (selectedRows:Obj[]) => {
    emit('selection', selectedRows);
  };

  return {
    selectionChange,
  };
};

export default useSelection;
