import i18n from '@/i18n';

type WithLength = { length: number };
type Options = { min?: number, max?: number, message?: string };

export function strLength(withLength: WithLength, options: Options) {
  const { length } = withLength;
  const { min = 0, max = Infinity, message } = options;
  const below = length < min;
  const above = length > max;

  // max 和 min 同时校验时
  if (max && min && (below || above)) {
    throw new Error(message ?? i18n.t('validator.char_len_between', { min, max }));
  }
  // 只校验 min 时
  if (below) {
    throw new Error(message ?? i18n.t('validator.char_len_at_least', { min }));
  }
  // 只校验 max 时
  if (above) {
    throw new Error(message ?? i18n.t('validator.char_len_not_exceed', { max }));
  }
}
export default strLength;
