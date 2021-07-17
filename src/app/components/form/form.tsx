import { Component } from 'react';
import { AppContext } from '../../context/app.provider';
import { FormControl } from './models/control.model';
import FormInput from './form-input';
import FormSelect from './form-select';
import SelectControl from './models/select.model';
import FormTextArea from './form-textarea';

type FormProps = {
  controls: FormControl[];
  onChange: (controls: FormControl[]) => void;
};

export default class Form extends Component<FormProps, any> {
  static contextType = AppContext;

  constructor(props: FormProps) {
    super(props);
    this.state = {
      controls: props.controls,
    };
  }

  componentDidUpdate(prevProps: FormProps) {
    // Check if props have been updated and update form controls
    const controlsUpdated = this.props.controls !== prevProps.controls;
    if (controlsUpdated) {
      this.setState({ ...this.state, controls: this.props.controls });
    }
  }

  render() {
    return this.state.controls.map((c: any, i: number) => {
      c.onChange = c.onChange || ((e: any) => this.defaultOnChange(e, c));
      return (
        <div className="form-group" key={`update-control-${i}`}>
          {c.label ? <label>{c.label}</label> : <></>}
          {c instanceof SelectControl ? (
            <FormSelect control={c} />
          ) : c.type === 'textarea' ? (
            <FormTextArea control={c} />
          ) : (
            <FormInput control={c} />
          )}
        </div>
      );
    });
  }

  defaultOnChange = (e: any, control: FormControl) => {
    control.value = e.target.value;
    if (this.props.onChange) this.props.onChange(this.state.controls);
  };
}
