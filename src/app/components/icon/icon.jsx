export default function Icon({ dataIcon, classes, click, inline = true }) {
  return click ? (
    ClickableIcon({ dataIcon, classes, click, inline })
  ) : (
    <span
      className={`iconify ${classes ? classes : ''}`}
      data-icon={dataIcon}
      data-inline={inline ? 'true' : 'false'}></span>
  );
}

function ClickableIcon({ dataIcon, classes, click, inline }) {
  return (
    <span
      className={`iconify clickable ${classes ? classes : ''}`}
      data-icon={dataIcon}
      data-inline={inline ? 'true' : 'false'}
      onClick={click}></span>
  );
}
