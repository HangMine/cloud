import i18n from '@/i18n';

const r = /^1[3-9](\d){9}$/;
export function validMobilePhone(str: string, { message = i18n.t('validator.invalid_phone') }: { message?: string } = {}): void {
  if (!str) return;
  if (!r.test(str)) throw new Error(message);
}
export default validMobilePhone;
