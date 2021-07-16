import { FormControl } from './control.model';

type Option = {
  name: string;
  value: string;
  disabled?: boolean;
};

export default class SelectControl extends FormControl {
  options: Option[];

  constructor(object: SelectControl) {
    super(object);
    this.options = object.options;
  }
}
