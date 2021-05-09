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

export function IconButton({ dataIcon, click, classes = "", iconClasses = "", text }) {
  const t = text? <span className="mx-2">{text}</span>: null;
  return (
    <div className={`btn btn-icon ${classes}`} onClick={click}>
      <Icon dataIcon={dataIcon} classes={iconClasses} />
      {t}
    </div>
  );
}
