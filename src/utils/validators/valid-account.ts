import validEmail from './valid-email';
import validFilled from './valid-filled';
import validMobilePhone from './valid-mobile-phone';

export function validAccount(val: string, { message }: { message?: string } = {}): void {
  validFilled(val, { message: message ?? '账号名不能为空' });
  if (val.includes('@')) {
    validEmail(val, { message: message ?? '邮箱不合法' });
  } else {
    validMobilePhone(val, { message: message ?? '手机号不合法' });
  }
}
export default validAccount;
