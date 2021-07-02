import { Link } from 'react-router-dom';
import Icon from '../icon/icon';

export default function Card(props) {
  if (props.image) {
    return ImageCard(props);
  } else if (props.icon) {
    return IconCard(props);
  } else {
    return TextCard(props);
  }
}

function IconCard({
  text,
  icon,
  click,
  color = '',
  classes = '',
  iconClasses = '',
  linkTo,
}) {
  const cardClasses = `card ${color} m-1 py-3 row ${
    click ? 'clickable' : ''
  } ${classes}`;
  const textEl = text ? (
    <p className="text-center m-auto col-12">{text}</p>
  ) : null;
  if (linkTo) {
    return (
      <Link to={linkTo} className={cardClasses}>
        <Icon dataIcon={icon} classes={`mx-auto my-2 ${iconClasses}`} />
        {textEl}
      </Link>
    );
  } else {
    return (
      <div onClick={click ? click : () => {}} className={cardClasses}>
        <Icon dataIcon={icon} classes={`mx-auto my-2 ${iconClasses}`} />
        {textEl}
      </div>
    );
  }
}

function ImageCard({ text, image, click, color = '', classes = '', linkTo }) {
  const cardClasses = `card ${color} m-1 pb-3 row ${
    click ? 'clickable' : ''
  } ${classes}`;
  const textEl = text ? (
    <p className="text-center m-auto col-12">{text}</p>
  ) : null;
  if (linkTo) {
    return (
      <Link to={linkTo} className={cardClasses}>
        <img src={image} classes="mx-auto" alt="" />
        {textEl}
      </Link>
    );
  } else {
    return (
      <div onClick={click} className={cardClasses}>
        <img src={image} classes="mx-auto" alt="" />
        {textEl}
      </div>
    );
  }
}

function TextCard({
  text,
  click,
  color = '',
  classes = '',
  linkTo = undefined,
}) {
  const cardClasses = `card ${color} m-1 py-3 row ${
    click ? 'clickable' : ''
  } ${classes}`;
  const textEl = text ? (
    <p className="text-center m-auto col-12">{text}</p>
  ) : null;
  if (linkTo) {
    return (
      <Link to={linkTo}>
        <div onClick={click} className={cardClasses}>
          {textEl}
        </div>
      </Link>
    );
  }
  return (
    <div onClick={click} className={cardClasses}>
      {textEl}
    </div>
  );
}
