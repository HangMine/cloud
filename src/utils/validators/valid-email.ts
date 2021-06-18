import i18n from '@/i18n';

export function validEmail(email: string, { message = i18n.t('validator.invalid_email') }: { message?: string } = {}): void {
  if (!email) return;
  const reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
  if (!reg.test(email)) {
    throw new Error(message);
  }
}

export default validEmail;
