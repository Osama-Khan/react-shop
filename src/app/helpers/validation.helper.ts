/**
 * Validates a given value based on the given validators
 * @param value value to validate
 * @param validators set of validators to validate value
 * @returns true if value is valid, else false
 */
export default function validate(value: any, validators: string[]) {
  return validators.some((v) => {
    const ind = v.indexOf('(');
    const indEnd = v.indexOf(')');
    if (ind !== -1) {
      const numStr = v.substring(ind + 1, indEnd);
      const num = parseInt(numStr);
      v = v.substring(0, ind);
      if (num)
        switch (v) {
          case 'min':
            if (value.length < num) return false;
            break;
          case 'max':
            if (value.length > num) return false;
            break;
          default:
            break;
        }
    } else {
      switch (v) {
        case 'notEmpty':
          if (value === '') return false;
          break;
        case 'notNull':
          if (!value) return false;
          break;
        case 'isEmail':
          if (!isEmail(value)) return false;
          break;
        default:
          break;
      }
    }
    return true;
  });
}

const emailRegex: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
const isEmail = (email: string) => emailRegex.test(email);
