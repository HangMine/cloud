import i18n from '@/i18n';


export function validFilled(v: unknown, { message = i18n.t('validator.not_empty') }: { message?: string } = {}): void {
  if (typeof v === 'string') {
    v = v.trim();
    if (v) return;
  } else if (typeof v === 'number') {
    return;
  } else if (typeof v === 'boolean') return;
  else if (
    v && typeof v === 'object'
    && (Array.isArray(v) ? v.length : Object.values(v).filter((item) => item !== undefined).length)
  ) {
    return;
  } else if (typeof v === null) {
    return;
  }
  throw new Error(message);
}

export default validFilled;
