import i18n from '@/i18n';

const r = /^[0-9-\s]{6,30}$/;
export function validMobilePhone(str: string, { message = i18n.t('validator.invalid_phone') }: { message?: string } = {}): void {
  if (!str) return;
  if (!r.test(str)) throw new Error(message);
}
export default validMobilePhone;
