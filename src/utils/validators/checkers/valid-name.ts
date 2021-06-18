import validator2Checker from '@/utils/validators/utils/validator-to-checker';
import validName from '@/utils/validators/valid-name';

export const isValidName = validator2Checker(
  validName,
  true,
  (e: Error) => e.message,
);

export default isValidName;
