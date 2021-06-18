<template>
  <el-table-column
    :key="column.key"
    :prop="column.key"
    :label="column.title"
    :min-width="column.minWidth || column.minWid"
    :align="column.align || 'center'"
    :sortable="column.sort ? 'custom' : undefined"
    show-overflow-tooltip
    v-bind="column"
  >
    <template #default="{ row, $index }">
      <slot :name="column.key" :row="row" :index="$index">
        {{ column.key === "tool" || unFalsy(row[column.key]) ? row[column.key] : "--" }}
      </slot>
    </template>
    <!-- <template v-if="column.children">
        <h-table-column v-for="childColumn of column.children" :key="childColumn.key" :column="childColumn">
          <template v-for="columnKey of getColumnKeys(column)" #[columnKey]="{ row, index }">
            <slot :name="columnKey" :row="row" :index="index"> </slot>
          </template>
        </h-table-column>
      </template> -->
  </el-table-column>
</template>

<script lang="ts">
import { unFalsy } from '../form/HForm/utils';
import { getColumnKeys } from './utils';

export default {
  name: 'h-table-column',
  props: {
    column: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      getColumnKeys,
    };
  },
  methods: {
    unFalsy(value: any) {
      return unFalsy(value);
    },
  },
};
</script>
<style lang="scss">
/* @import 'url'; */
</style>
