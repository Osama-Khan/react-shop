import Icon from '../../components/icon/icon';

/** Shows a summary of the ratings on a product using progress bars */
export default function RatingSummary({ ratings }) {
  // Represents number of 1-5 stars on the product
  // Stars:    1, 2, 3, 4, 5
  let stars = [0, 0, 0, 0, 0];
  const totalStars = ratings.length;

  // Set the respective star for each rating
  ratings.forEach((r) => stars[r.stars - 1]++);

  // Moves 5 star at top and 1 star at bottom
  stars = stars.reverse();
  return (
    <div className="bg-light rounded p-2">
      {stars.map((s, i) => (
        <RatingSummaryStar
          key={'summary-star-' + i}
          number={5 - i}
          stars={s}
          totalStars={totalStars}
        />
      ))}
    </div>
  );
}

const RatingSummaryStar = ({ number, stars, totalStars }) => {
  const width = totalStars === 0 ? 0 : (stars / totalStars) * 100;
  return (
    <div className="row mx-0">
      <div className="col-2 col-md-4 col-lg-2 p-0 pr-2 text-right">
        {number}&nbsp;
        <Icon dataIcon="fa:star" />
      </div>
      <div className="col-10 col-md-8 col-lg-10 p-0 my-auto">
        <div className="progress text-center">
          <div
            className="progress-bar bg-yellow font-weight-bold"
            role="progressbar"
            style={{ width: `${width}%` }}
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100">
            {stars}
          </div>
          {stars === 0 ? <span className="m-auto text-muted">0</span> : ''}
        </div>
      </div>
    </div>
  );
};
