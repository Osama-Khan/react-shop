import Icon from "../icon/icon";

export function PrimaryButton({
  text,
  outline,
  disabled = false,
  classes = "",
  click = () => {},
}) {
  return (
    <button
      className={`btn btn-primary${outline ? "-outline" : ""} ${classes}`}
      disabled={disabled}
      onClick={click}>
      {text}
    </button>
  );
}

export function SecondaryButton({
  text,
  outline,
  disabled = false,
  classes = "",
  click = () => {},
}) {
  return (
    <button
      className={`btn btn-secondary${outline ? "-outline" : ""} ${classes}`}
      disabled={disabled}
      onClick={click}>
      {text}
    </button>
  );
}

export function IconButton({
  dataIcon,
  click,
  classes = "btn-primary-outline",
  iconClasses = "",
  text,
  disabled = false,
}) {
  const t = text ? <span className="mx-2">{text}</span> : null;
  return (
    <button
      className={`btn btn-icon ${classes}`}
      onClick={click}
      disabled={disabled}>
      <Icon dataIcon={dataIcon} classes={iconClasses} />
      {t}
    </button>
  );
}
