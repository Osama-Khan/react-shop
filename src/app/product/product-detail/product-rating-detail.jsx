import React from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/loading/loading-spinner';
import Pagination from '../../components/pagination/pagination';
import ProductRating from '../../components/product-rating/product-rating';
import { AppContext } from '../../context/app.provider';
import Criteria from '../../models/criteria';
import { userUrl } from '../../routes';

/** Shows list of ratings on a product along with pagination */
export default class ProductRatingDetail extends React.Component {
  static contextType = AppContext;
  criteria;

  constructor(props) {
    super(props);
    this.state = { ratings: undefined, meta: undefined };
  }
  componentDidMount() {
    const productId = this.props.product.id;

    // Set criteria for future fetches
    this.criteria = new Criteria();
    this.criteria.addRelation('user');
    this.criteria.addFilter('product', productId);
    this.criteria.setLimit(5);

    this.fetchRatings();
  }

  render() {
    // Wait until ratings are fetched
    if (!this.state.ratings) return <LoadingSpinner />;

    // Show message if no ratings exist
    if (this.state.ratings.length === 0)
      return <h3 className="text-center text-muted my-5">No reviews</h3>;

    // Create a rating card for each rating
    const details = this.state.ratings.map((r) => (
      <this.RatingDetail key={'rating-' + r.id} rating={r} />
    ));

    // Create pagination if state has meta
    const pagination = this.state.meta ? (
      <div className="d-flex">
        <div className="ml-auto">
          <Pagination
            currentPage={this.state.meta.currentPage}
            gotoPage={(p) => {
              this.criteria.setPage(p);
              this.setState({ ...this.state, ratings: undefined });
              this.fetchRatings();
            }}
            totalPages={this.state.meta.totalPages}
          />
        </div>
      </div>
    ) : (
      <></>
    );
    return (
      <div>
        {details}
        {pagination}
      </div>
    );
  }

  /** Formats a rating into a card view */
  RatingDetail = ({ rating }) => (
    <div className="card flex-md-row flex-sm-column shadow-sm mb-2">
      <div className="col-sm-12 col-md-4 col-lg-2 d-flex flex-column my-2 border-right">
        <img
          src={rating.user.profileImage}
          className="img-small rounded-circle border shadow-sm mx-auto"
          alt="Reviewer"
        />
        <Link
          to={`${userUrl}/${rating.user.id}`}
          className="font-weight-bold text-center">
          @{rating.user.username}
        </Link>
      </div>
      <div className="col-sm-12 col-md-8 col-lg-10 my-auto">
        <ProductRating rating={rating.stars} classes="float-right" />
        <h4>{rating.title || <span className="text-muted">No Title</span>}</h4>
        <p>
          {rating.description || (
            <span className="text-muted">No Description</span>
          )}
        </p>
      </div>
    </div>
  );

  /**
   * Fetches ratings of the current product
   * @param {Criteria} criteria
   */
  fetchRatings = () => {
    this.context.services.productService.getRatings(this.criteria).then((r) => {
      this.setState({ ...this.state, ratings: r.data.data, meta: r.data.meta });
    });
  };
}
