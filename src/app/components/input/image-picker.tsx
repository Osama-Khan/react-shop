import { Component, createRef } from 'react';
import Icon from '../icon/icon';

type ImagePickerProps = {
  defaultImage: string;
  onPick: (picked: string) => any;
  maxSize?: number;
  validFormats?: string[];
};

export default class ImagePicker extends Component<
  ImagePickerProps,
  { selected: any }
> {
  pickerRef: React.RefObject<HTMLInputElement>;

  constructor(props: ImagePickerProps) {
    super(props);
    this.state = { selected: undefined };
    this.pickerRef = createRef();
  }

  render() {
    return (
      <div
        className="text-clickable"
        onClick={() => this.pickerRef.current?.click()}>
        {this.state.selected || this.props.defaultImage ? (
          <img
            className={`img-large bg-light shadow-sm border p-1${
              this.state.selected ? ' border-green bg-green-subtle' : ''
            }`}
            src={this.state.selected || this.props.defaultImage}
            alt="Current"
          />
        ) : (
          <div className="icon-lg img-large d-flex bg-light">
            <Icon classes="m-auto" dataIcon="fa:plus" />
          </div>
        )}
        <input
          type="file"
          alt="Select Image"
          ref={this.pickerRef}
          onChange={(event) => {
            const img = event.target.files?.item(0);
            if (!img) return;

            if (this.validateFile(img)) {
              this.toBase64(img, (result: string) => {
                this.setState({ selected: result });
                this.props.onPick(result);
              });
            }
          }}
          hidden
        />
      </div>
    );
  }

  toBase64 = (file: File, cb: (res: any) => any) => {
    const fr = new FileReader();
    fr.onload = (res) => {
      cb(res.target!.result);
    };
    fr.readAsDataURL(file);
  };

  validateFile = (file: File) => {
    // File format validation
    if (this.props.validFormats) {
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];

      if (!this.props.validFormats.includes(ext)) {
        return false;
      }
    }

    // File size validation
    if (file.size > (this.props.maxSize || Number.MAX_VALUE)) {
      return false;
    }

    return true;
  };
}
