import Icon from "../icon/icon";

export default function ProductRating({rating, classes}) {
  const stars = rating? rating: 0;
  const starsEl = [];
  if (stars > 0) {
    let iters, count = 0;
    for (iters = stars; iters >= 1; iters--) {
      starsEl.push(<Icon dataIcon="bi-star-fill"></Icon>);
      count++;
    }
    if (iters !== 0) {
      starsEl.push(<Icon dataIcon="bi-star-half"></Icon>);
      count++;
    }
    while (count < 5) {
      starsEl.push(<Icon dataIcon="bi-star"></Icon>);
      count++;
    }
  } else {
    for (let i = 0; i < 5; i++) {
      starsEl.push(<Icon dataIcon="bi-star"></Icon>);
    }
  }
  return (
    <div className={`p-1 ${classes}`}>
      {starsEl}
      <span className="text-dark"> | {rating ? rating + " Stars" : "No ratings"}</span>
    </div>
  );
}