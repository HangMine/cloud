import validWhitespace from './valid-white-space';
import isFilled from './valid-filled';
import strLength from './str-length';

const defaults = {
  max: Infinity,
  min: 0,
};
function validName(name: string, { max = defaults.max, min = defaults.min, message }: { max: number, min: number, message?: string } = defaults) {
  validWhitespace(name);
  isFilled(name, { message });
  strLength(name, { message, max, min });
}

export default validName;
