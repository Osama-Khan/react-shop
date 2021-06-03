export default function Icon({ dataIcon, classes, click }) {
  return click ? (
    ClickableIcon({ dataIcon, classes, click })
  ) : (
    <span
      className={`iconify ${classes ? classes : ""}`}
      data-icon={dataIcon}
      data-inline="false"></span>
  );
}

function ClickableIcon({ dataIcon, classes, click }) {
  return (
    <span
      className={`iconify clickable ${classes ? classes : ""}`}
      data-icon={dataIcon}
      data-inline="false"
      onClick={click}></span>
  );
}
