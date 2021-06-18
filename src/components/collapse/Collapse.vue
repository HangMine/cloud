<script>
import i18n from 'i18next';

export default {
  name: 'CustomCollaps',
  functional: true,
  props: {
    /**
     * 标题名称
     */
    title: {
      type: String,
      default: i18n.t('public.title'),
    },
    /**
     * 标题的CSS
     */
    styles: {
      type: Object,
      default: () => ({}),
    },

    divider: {
      type: Boolean,
      default: true,
    },
    /**
     * 折叠展开的状态
     */
    closed: {
      type: Boolean,
      default: false,
    },
  },
  render(_, { props, slots }) {
    return (
      <el-collapse value="1-1" class="collapse-custom">
        <el-collapse-item name={props.closed ? '' : '1-1'}>
          <template slot="title">
            <h2 class={{ 'collapse-divider': props.divider }} style={props.styles}>{props.title}</h2>
          </template>
          {slots().default}
        </el-collapse-item>
      </el-collapse>
    );
  },
};
</script>

<style lang="scss" scoped>
.collapse-custom {
  &.el-collapse,
  .el-collapse-item__header,
  .el-collapse-item__wrap {
    border: none;
  }

  .el-icon-arrow-right {
    font-size: 20px;
  }

  .collapse-divider {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    color: #333;

    &::after {
      content: "";
      display: block;
      flex: 1;
      height: 1px;
      margin-left: 20px;
      margin-right: 10px;
      background-color: #ddd;
    }
  }
}
</style>
