import { defineComponent } from '@vue/runtime-core';
import TableList from '../components/tableList';

export default defineComponent({
  name: 'sample',
  props: {},
  components: { TableList },
  setup() {
    return () => (
      <div class="sample">
        <TableList applyType="1" title="合作申请"></TableList>
      </div>
    );
  },
});
