import {
  InvalidFormatException,
  MaxSizeExceededException,
} from '../exceptions/image-picker-exceptions';

/** Props for ImagePicker component */
export type ImagePickerProps = {
  /** Default image to show in case no image is selected */
  defaultImage: string;

  /** Maximum size allowed for image in bytes */
  maxSize?: number;

  /** Valid formats for the image */
  validFormats?: string[];

  /** Prevents selected image preview if set to true */
  noPreview?: boolean;

  /** Allows multiple file selection for input */
  allowMultiple?: boolean;

  /** Sets the limit of images to select. Only works when allowMultiple is set to true. */
  maxImages?: number;

  /** Method called when the user has picked image(s) */
  onPick: (picked: string[]) => any;

  /** Method called when the user picks an invalid image */
  onError?: (error: MaxSizeExceededException | InvalidFormatException) => void;
};
