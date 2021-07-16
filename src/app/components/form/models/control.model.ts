export abstract class FormControl {
  private _dirty = false;
  private _value: string = '';

  label?: string;
  id?: number;
  name?: string;
  placeholder?: string;
  onChange?: (e: any) => any;
  validators: ((v: any) => boolean)[] = [];

  constructor(object: FormControl) {
    if (object.label) this.label = object.label;
    if (object.id) this.id = object.id;
    if (object.name) this.name = object.name;
    if (object.placeholder) this.placeholder = object.placeholder;
    if (object.value) this._value = object.value;
    if (object.onChange) this.onChange = object.onChange;
    if (object.validators) this.validators = object.validators;
  }

  get isValid() {
    return this.validators.every((v) => v(this.value));
  }

  get isDirty() {
    return this._dirty;
  }

  get value() {
    return this._value;
  }

  set value(value: string) {
    this._dirty = true;
    this._value = value;
  }
}
