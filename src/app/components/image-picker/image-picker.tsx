import React, { Component, createRef } from 'react';
import Icon from '../icon/icon';
import {
  InvalidFormatException,
  MaxSizeExceededException,
} from './exceptions/image-picker-exceptions';
import type { ImagePickerProps } from './types/image-picker-props.type';

/** Renders an image picker that allows user to select images */
export default class ImagePicker extends Component<
  ImagePickerProps,
  { selected: any }
> {
  private _pickerRef: React.RefObject<HTMLInputElement>;

  constructor(props: ImagePickerProps) {
    super(props);
    this.state = { selected: undefined };
    this._pickerRef = createRef();
  }

  render() {
    return (
      <div
        className="text-muted text-clickable"
        onClick={() => this._pickerRef.current?.click()}>
        {this.state.selected || this.props.defaultImage ? (
          <img
            className={`img-large bg-light shadow-sm border p-1${
              this.state.selected ? ' border-green bg-green-subtle' : ''
            }`}
            src={this.state.selected || this.props.defaultImage}
            alt="Current"
          />
        ) : (
          <div className="icon-lg img-large d-flex bg-light border">
            <Icon classes="m-auto" dataIcon="bx-bxs-image-add" />
          </div>
        )}
        <input
          type="file"
          alt="Select Image"
          ref={this._pickerRef}
          multiple={this.props.allowMultiple}
          onChange={(e) => this.onFilePick(e)}
          hidden
        />
      </div>
    );
  }

  /** Encodes all files in the event and passes them to onPick method of props */
  onFilePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imgs = event.target.files;
    if (!imgs) return;

    const limit = this.props.allowMultiple
      ? this.props.maxImages || imgs.length
      : 1;

    const promises: Promise<string>[] = [];

    for (let i = 0; i < limit; i++) {
      try {
        this.validateImage(imgs[i]);
        promises.push(this.encode(imgs[i]));
      } catch (e) {
        e.message += limit > 1 ? ` (File ${i + 1})` : '';
        if (this.props.onError) this.props.onError(e);
      }
    }

    Promise.all(promises).then((values: string[]) => {
      this.props.onPick(values);
      if (!this.props.noPreview) {
        this.setState({ selected: values[values.length - 1] });
      }
    });
  };

  /** Returns a promise that resolves to the encoded image string */
  encode = (file: File) =>
    new Promise<string>((resolve) => {
      const fr = new FileReader();
      fr.onload = (res) => resolve(res.target!.result!.toString());
      fr.readAsDataURL(file);
    });

  /** Validates image and throws error in case of failure */
  validateImage = (image: File) => {
    // File format validation
    if (this.props.validFormats) {
      const parts = image.name.split('.');
      const ext = parts[parts.length - 1];

      if (!this.props.validFormats.includes(ext)) {
        const formats = this.props.validFormats.join(', ');
        throw new InvalidFormatException(
          `Image format must be one of: ${formats}`,
        );
      }
    }

    // File size validation
    const max = this.props.maxSize || Number.MAX_VALUE;
    if (image.size > max) {
      const mb = max / 1000000;
      throw new MaxSizeExceededException(`Max size allowed is ${mb} MBs`);
    }

    return true;
  };
}
