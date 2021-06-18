 <template>
  <div class="input-unit">
    <el-input
      v-model="text"
      :placeholder="inputPlaceholder"
      :disabled="disabled"
      class="input-unit-number"
      @keyup.native="handleChangeUnitNumber"
    />
    <el-select
      v-if="!withoutSelect"
      v-model="selectedUnit"
      :disabled="disabled"
      class="input-unit-unit"
      @change="$emit('on-select-change', selectedUnit)"
    >
      <el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script>
import i18n from 'i18next';
import { debounce } from 'throttle-debounce';

export default {
  props: {
    // 不要select
    withoutSelect: {
      type: Boolean,
      default: false,
    },
    // 输入框值
    value: {
      type: [String, Number],
      default: '',
    },
    // 输入框 placeholder
    inputPlaceholder: {
      type: String,
      default: '',
    },
    // 单位选择 默认选择的单位
    defaultUnit: {
      type: [String, Number],
      default: '',
    },
    // 单位选择数组
    unitOptions: {
      type: Array,
      required: true,
    },
    // 小数点后保留位数(最大不能超过8位)
    decimalPlaces: {
      type: Number,
      default: 2,
    },
    // 整数位数(最大不能超过7位)
    integerPlaces: {
      type: Number,
      default: 8,
    },
    // 间隔阈值
    threshold: {
      type: Number,
      default: 500,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      text: '',
      selectedUnit: '',
    };
  },
  mounted() {
    this.text = this.value;
    this.selectedUnit = this.defaultUnit;
    // eslint-disable-next-line func-names
    this.handleChangeUnitNumber = debounce(this.threshold, function () {
      this.changeUnitNumber();
    });
  },
  watch: {
    value(value) {
      this.text = value;
    },
    defaultUnit(value) {
      this.selectedUnit = value;
    },
  },
  methods: {
    // debouce 延迟处理键盘输入校验
    // eslint-disable-next-line
    // handleChangeUnitNumber: debounce(function () {
    //   this.changeUnitNumber();
    // }, this.threshold),
    changeUnitNumber() {
      if (this.text === '') {
        this.$emit('on-input-blur', this.text);
        return;
      }

      // 暂时保存原始的输入的文本
      const temp = this.text;
      const limitInt = this._addNumberSeparator();

      this.text = parseFloat(this.text, 10);
      // 处理非数字类型
      if (Number.isNaN(this.text)) this.text = '';
      // 处理负数情况
      if (this.text < 0) this.text = -this.text;

      // 处理科学法情况
      if (String(this.text).includes('e')) {
        this.$message.warning(i18n.t('public.form.max_num_exceed', { limit: limitInt }));
        this.text = String(temp).slice(0, this.integerPlaces);
        return;
      }

      // 最大值处理
      if (this.text >= `1${'0'.repeat(this.integerPlaces)}`) {
        this.$message.warning(i18n.t('public.form.max_num_exceed', { limit: limitInt }));
        this.text = String(this.text).slice(0, this.integerPlaces);
        return;
      }
      // 小数点处理
      const isDecimal = String(this.text).includes('.');
      if (isDecimal) this._handleDecimalNumber();

      this.$emit('on-input-blur', this.text);
    },
    // 处理小数点情况
    _handleDecimalNumber() {
      const number = Math.round(this.decimalPlaces);
      const [int, dec] = String(this.text).split('.');
      if (number <= 0) {
        this.text = int;
      } else if (number >= 8) {
        this.text = `${int}.${dec.slice(0, 8)}`;
        this.$message.warning(i18n.t('public.form.keep_decimal_places', { num: 8 }));
      } else if (dec.length > number) {
        this.text = `${int}.${dec.slice(0, number)}`;
        this.$message.warning(i18n.t('public.form.keep_decimal_places', { num: number }));
      }
    },
    // 处理数字分隔符问题
    _addNumberSeparator() {
      const number = Number(`1${'0'.repeat(this.integerPlaces)}`);
      return number.toLocaleString('en-US');
    },
  },
};
</script>

<style scoped>
.input-unit {
  display: flex;
  height: 33px;
}
.input-unit-number {
  margin-right: 10px;
}
.input-unit-unit {
  width: 140px;
}
</style>
