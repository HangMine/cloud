import { defineComponent } from '@vue/runtime-core';
import TableList from '../components/tableList';

export default defineComponent({
  name: 'sample',
  props: {},
  components: { TableList },
  setup() {
    return () => (
      <div class="sample">
        <TableList applyType="2" title="样品申请"></TableList>
      </div>
    );
  },
});
