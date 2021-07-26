import { FormControl } from './control.model';

export default class InputControl extends FormControl {
  type?: string = 'text';

  constructor(object: Partial<InputControl>) {
    super(object);
    if (object.type) this.type = object.type;
  }
}
