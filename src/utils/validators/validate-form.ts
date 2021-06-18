import { ElForm } from 'element-plus/';
import AppError from '@/utils/error';
import i18n from '@/i18n';

export const validateForm = (form: typeof ElForm, errorText = i18n.t('validator.form_val_fail')): Promise<void> => {
  return new Promise((resolve, reject) => {
    form.validate((valid, invalidFields) => {
      if (valid) {
        resolve();
      } else {
        reject(new AppError(errorText, {
          level: AppError.LEVELS.ERROR,
          invalidFields,
          muted: true,
        }));
      }
    });
  });
};
export default validateForm;
