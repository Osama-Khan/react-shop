import Icon from "../icon/icon";

export function PrimaryButton({ text, outline }) {
  return (
    <button class={`btn btn-primary${outline ? "-outline" : ""}`}>
      {text}
    </button>
  );
}

export function SecondaryButton({ text, outline }) {
  return (
    <button class={`btn btn-secondary${outline ? "-outline" : ""}`}>
      {text}
    </button>
  );
}

export function IconButton({ icon, click, classes, iconClasses }) {
  return (
    <div className={`btn btn-icon ${classes}`}>
      <Icon dataIcon={icon} classes={iconClasses} />
    </div>
  );
}
