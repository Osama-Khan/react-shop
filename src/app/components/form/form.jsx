import { Component } from "react";
import { AppContext } from "../../context/app.provider";
import validate from "../../helpers/validation.helper";
import { IconButton, PrimaryButton } from "../button/Button";

export default class Form extends Component {
  static contextType = AppContext;

  constructor({
    controls,
    onSubmit,
    btnText,
    btnClasses,
    btnIconClasses,
    btnDataIcon,
  }) {
    super();
    this.state = {
      controls: controls.map((c) => Object.assign({}, c)),
      valid: undefined,
    };
  }

  render() {
    const controls = this.state.controls.map((c, i) => {
      return (
        <div className="form-group" key={`update-control-${i}`}>
          <label>{c.label || undefined}</label>
          <input
            id={c.id || undefined}
            name={c.name || undefined}
            type={c.type || "text"}
            className={
              (c.className || "form-control ") +
              (c.valid === false
                ? "is-invalid"
                : c.valid === true
                ? "is-valid"
                : "")
            }
            value={c.value || undefined}
            onChange={(e) => {
              if (c.onChange) c.onChange(e);
              c.value = e.target.value;
              c.valid = validate(c.value, c.validators);
              this.updateValidity();
            }}
            onClick={c.onClick || undefined}
            validators={c.validators || undefined}
          />
        </div>
      );
    });
    const button = this.props.btnDataIcon ? (
      <IconButton
        dataIcon={this.props.btnDataIcon}
        text={this.props.btnText || "Submit"}
        classes={`btn-primary btn-block${this.props.btnClassName || ""}`}
        iconClasses={this.props.btnIconClassName}
        click={this.onSubmit}
        disabled={!this.state.valid}
      />
    ) : (
      <PrimaryButton
        text={this.props.btnText || "Submit"}
        classes={`btn-block ${this.props.btnClassName || ""}`}
        click={this.onSubmit}
        disabled={!this.state.valid}
      />
    );

    return (
      <div>
        {controls}
        {button}
      </div>
    );
  }

  updateValidity() {
    const valid = this.state.controls.every((c) => c.valid !== false);
    this.setState({ ...this.state, valid });
  }

  onSubmit = () => {
    if (!this.state.valid) {
      if (this.state.valid === false) {
        this.context.services.uiService.errorToast("Invalid data");
        return;
      }
      this.context.services.uiService.errorToast("No changes to update");
    }
    const data = this.state.controls.map((c) => c.value);
    this.props.onSubmit(data);
  };
}
