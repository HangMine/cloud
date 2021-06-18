
import i18n from '@/i18n';

function validWhitespace(str: string) {
  if (str.trim() !== str) {
    throw new Error(i18n.t('validator.white_space'));
  }
}
export default validWhitespace;
