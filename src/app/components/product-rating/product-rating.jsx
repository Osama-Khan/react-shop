import Icon from '../icon/icon';

export default function ProductRating({ rating, classes }) {
  const starsEl = [];
  if (rating > 0) {
    let iters,
      count = 0;
    for (iters = rating; iters >= 1; iters--) {
      starsEl.push(<Icon key={count} dataIcon="bi-star-fill" />);
      count++;
    }
    if (iters !== 0) {
      starsEl.push(<Icon key={count} dataIcon="bi-star-half" />);
      count++;
    }
    while (count < 5) {
      starsEl.push(<Icon key={count} dataIcon="bi-star" />);
      count++;
    }
  } else {
    for (let i = 0; i < 5; i++) {
      starsEl.push(<Icon key={i} dataIcon="bi-star" />);
    }
  }

  let textClass = rating ? 'text-dark' : 'text-muted';
  textClass += ' ml-1 border-left';
  const divClass = rating ? 'text-yellow' : 'text-muted';

  return (
    <div className={`p-1 ${divClass} ${classes ? classes : ''}`}>
      {starsEl}
      <span className={textClass}>
        &nbsp;
        {rating ? rating + ' Stars' : 'No ratings'}
      </span>
    </div>
  );
}
