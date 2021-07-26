import { FormControl } from './control.model';

type Option = {
  name: string;
  value: string;
  disabled?: boolean;
};

type SelectControlObject = Partial<FormControl> & {
  options: Option[];
};

export default class SelectControl extends FormControl {
  options: Option[];

  constructor(object: SelectControlObject) {
    super(object);
    this.options = object.options;
  }
}
