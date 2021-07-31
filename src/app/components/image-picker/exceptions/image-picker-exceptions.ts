/** An ImagePicker exception meaning the user has picked a file exceeding
 *  maximum given size.
 */
export class MaxSizeExceededException extends Error {
  constructor(message?: string) {
    const msg = message || 'Max size for image exceeded';
    super(msg);
    this.name = 'MaxSizeExceeded';
    this.message = msg;
  }
}

/** An ImagePicker exception meaning the user has picked a file with an
 *  invalid format.
 */
export class InvalidFormatException extends Error {
  constructor(message?: string) {
    const msg = message || 'Image format is not valid';
    super(msg);
    this.name = 'InvalidImageFormat';
    this.message = msg;
  }
}
