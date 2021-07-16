/**
 * @param value Value to validate
 * @returns true if control value is not null, false otherwise
 */
export function notNull(value: any) {
  return value !== null;
}

/**
 * @param value Value to validate
 * @returns true if control value is not empty, false otherwise
 */
export function notEmpty(value: string) {
  return value !== '';
}

/**
 * @param value Value to validate
 * @returns true if control value is a valid email, false otherwise
 */
export function isEmail(value: string) {
  const emailRegex: RegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
  return isPattern(value, emailRegex);
}

/**
 * @param value Value to validate
 * @param regexp Regular expression to match
 * @returns true if control value matches given pattern, false otherwise
 */
export function isPattern(value: string, regexp: RegExp) {
  return regexp.test(value);
}

/**
 * @param value Value to validate
 * @param limit Minimum value allowed for control
 * @returns true if control value is equal to or above given limit, false otherwise
 */
export function min(value: string, limit: number) {
  const v = parseInt(value);
  return v >= limit;
}

/**
 * @param value Value to validate
 * @param limit Maximum value allowed for control
 * @returns true if control value is equal to or below given limit, false otherwise
 */
export function max(value: string, limit: number) {
  const v = parseInt(value);
  return v <= limit;
}

/**
 * @param value Value to validate
 * @param limit Minimum length allowed for control value
 * @returns true if control value length is equal to or above given limit, false otherwise
 */
export function minLength(value: string, limit: number) {
  return value.length >= limit;
}

/**
 * @param value Value to validate
 * @param limit Maximum length allowed for control value
 * @returns true if control value length is equal to or below given limit, false otherwise
 */
export function maxLength(value: string, limit: number) {
  return value.length <= limit;
}
