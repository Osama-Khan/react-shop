import { Component } from 'react';
import ProductRating from '../../components/product-rating/product-rating';
import LoadingSpinner from '../../components/loading/loading-spinner';
import { AppContext } from '../../context/app.provider';
import Icon from '../../components/icon/icon';
import Form from '../../components/form/form';
import Criteria from '../../models/criteria';
import InputControl from '../../components/form/models/input.model';

const initialInputRating = {
  stars: 0,
  controls: [
    new InputControl({
      label: 'Title',
      name: 'title',
      placeholder: 'No Title',
    }),
    new InputControl({
      label: 'Description',
      name: 'description',
      type: 'textarea',
      placeholder: 'No Description',
    }),
  ],
};

const initialState = {
  rating: undefined,
  orderState: undefined,
  editing: false,
  inputRating: initialInputRating,
};

export default class OwnRating extends Component {
  static contextType = AppContext;
  fetching = false;

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const isLoggedIn = !!this.context.state.user.token;
    if (isLoggedIn) {
      this.fetchUserReview();
    }
  }

  componentDidUpdate() {
    const isLoggedIn = !!this.context.state.user.token;

    // Start fetching review if user logs in & rating has not been fetched
    if (isLoggedIn && !this.fetching && !this.state.rating) {
      this.fetchUserReview();
    }

    // If user has logged out and rating was fetched, clear previous data
    if (!isLoggedIn && this.state.rating) {
      this.setState(initialState);
    }
  }

  render() {
    const isLoggedIn = !!this.context.state.user.token;
    const isCheckingLogin = this.context.state.user.restoringState;
    // Don't show anything if there is no rating or login is being checked
    if (isCheckingLogin || !isLoggedIn) return <></>;

    const order = this.state.orderState?.state;
    return (
      <div className="rounded bg-light shadow-sm mb-2 mt-sm-2 mt-md-0 p-2">
        {
          // Show loading spinner while rating is being fetched
          this.state.rating === undefined ? (
            <LoadingSpinner />
          ) : this.state.rating && !this.state.editing ? (
            <this.ViewRating />
          ) : this.state.editing ? (
            <this.InputRating />
          ) : !order ? (
            <this.NoOrder />
          ) : order === 'Canceled' ? (
            <this.OrderCanceled />
          ) : order !== 'Delivered' ? (
            <this.OrderInProgress />
          ) : (
            <this.InputRating />
          )
        }
      </div>
    );
  }

  /** Component shown if user rating is being edited or doesn't exist */
  InputRating = () => {
    // Constants to change views based on stars
    const ratingLevels = ['Useless', 'Bad', 'Average', 'Good', 'Perfect'];
    const texts = [
      'text-red',
      'text-orange',
      'text-dark',
      'text-blue',
      'text-green',
    ];
    const bgs = [
      'bg-red-subtle',
      'bg-orange-subtle',
      'bg-white-subtle',
      'bg-blue-subtle',
      'bg-green-subtle',
    ];
    const btns = ['btn-red', 'btn-orange', 'btn-dark', 'btn-blue', 'btn-green'];

    const rating = this.state.inputRating;

    // Input stars view, ratingLevels is used because it has same length as stars
    const rateStars = ratingLevels.map((_, i) => (
      <span
        onClick={() => this.setStars(i + 1)}
        className={
          'text-clickable ' + (rating.stars > i ? 'text-yellow' : 'text-muted')
        }>
        <Icon dataIcon="fa:star" key={'input-star-' + i} />
      </span>
    ));

    return (
      <div>
        <div className="row mx-0">
          <h4 className="font-weight-bold">
            {this.state.editing ? 'Edit your Review' : 'Add a Review'}
          </h4>
          {this.state.editing ? (
            <div
              className="ml-auto mr-2 text-clickable icon-sm"
              title="Back to my review"
              onClick={() => this.setState({ ...this.state, editing: false })}>
              <Icon dataIcon="typcn-arrow-back" />
            </div>
          ) : (
            <></>
          )}
        </div>
        <hr />
        <div className="text-center h4 d-flex">
          <div className={`${bgs[rating.stars - 1]}  rounded mx-auto p-2`}>
            {rateStars}
            <br />
            <span className={`${texts[rating.stars - 1]}`}>
              {ratingLevels[rating.stars - 1]}
            </span>
          </div>
          <div className="float-right">
            {
              // Show remove rating icon if rating exists
              rating.stars !== 0 ? (
                <span
                  className="text-clickable font-weight-bold h2"
                  onClick={(e) => this.setStars(0)}
                  title="Remove rating">
                  &times;
                </span>
              ) : (
                <></>
              )
            }
          </div>
        </div>
        {
          // Show title and description form along with rate button if rating is given
          rating.stars !== 0 ? (
            <form onSubmit={(e) => this.rate(e)}>
              <Form
                controls={rating.controls}
                onChange={(controls) => {
                  this.setState({
                    ...this.state,
                    inputRating: { ...this.state.inputRating, controls },
                  });
                }}
              />
              <div className="d-flex">
                <button className={`btn ${btns[rating.stars - 1]} ml-auto`}>
                  Rate
                </button>
              </div>
            </form>
          ) : (
            <></>
          )
        }
      </div>
    );
  };

  /** Component shown if user has not placed an order */
  NoOrder = () => (
    <div>
      <h4 className="font-weight-bold">No Order</h4>
      <hr />
      <p className="text-center text-muted">
        You need to place an order before you can leave a review
      </p>
    </div>
  );

  /** Component shown if order is in progress */
  OrderInProgress = () => (
    <div>
      <h4 className="font-weight-bold">Order in Progress...</h4>
      <hr />
      <p className="text-center">
        Your order is <b>{this.state.orderState.state}</b>
      </p>
      <p className="text-center">
        You will be allowed to leave a review once it is <b>Delivered</b>
      </p>
    </div>
  );

  /** Component shown if order is canceled */
  OrderCanceled = () => (
    <div>
      <h4 className="font-weight-bold">Order Canceled!</h4>
      <hr />
      <p className="text-center text-muted">
        Your order was <b className="text-red">Canceled</b>. You can leave a
        review once you have received an order.
      </p>
    </div>
  );

  /** Component shown if user has already rated the product */
  ViewRating = () => (
    <div>
      <div className="row mx-0">
        <h4 className="font-weight-bold">My Review</h4>
        <div
          className="ml-auto mr-2 text-blue text-clickable"
          title="Edit Review"
          onClick={() => this.setState({ ...this.state, editing: true })}>
          <Icon dataIcon="fa:pencil" />
        </div>
        <div
          className="mr-2 text-red text-clickable"
          title="Delete Review"
          onClick={() => this.remove()}>
          <Icon dataIcon="fa:trash" />
        </div>
      </div>
      <hr />
      <ProductRating classes="float-right" rating={this.state.rating.stars} />
      <h4>
        {this.state.rating.title || (
          <span className="text-muted">No Title</span>
        )}
      </h4>
      <p>
        {this.state.rating.description || (
          <span className="text-muted">No Description</span>
        )}
      </p>
    </div>
  );

  /** Sets selected stars for rating input */
  setStars = (stars) => {
    this.setState({
      ...this.state,
      inputRating: { ...this.state.inputRating, stars },
    });
  };

  /** Starts the rating submission process */
  rate(e) {
    e.preventDefault();
    const r = this.state.inputRating;

    // Notify user if stars are not valid
    if (r.stars < 1 || r.stars > 5) {
      this.context.services.uiService.toast('Please provide a star rating!');
      return;
    }

    // Initialize rating object
    const rating = this.state.editing
      ? { stars: r.stars }
      : {
          product: this.props.product.id,
          user: this.context.state.user.id,
          stars: r.stars,
        };

    // Fill rating object with form field values
    this.state.inputRating.controls.forEach((c) => {
      rating[c.name] = c.value;
    });

    // Initialize Promise and message
    const svc = this.context.services.productService;
    const promise = this.state.editing
      ? svc.editRating(this.state.rating.id, rating)
      : svc.addRating(rating);
    const msg = this.state.editing
      ? {
          loading: 'Updating rating...',
          success: 'Rating updated successfully!',
          error: 'Failed to update rating!',
        }
      : {
          loading: 'Adding rating...',
          success: 'Rating added successfully!',
          error: 'Failed to add rating!',
        };

    // Create a promise toast to notify user of request state
    this.context.services.uiService.promiseToast(promise, msg).then((res) => {
      this.setState({ ...this.state, rating: res.data.data });
    });
  }

  /** Starts the rating removal process */
  remove() {
    const id = this.state.rating.id;

    // Warn user
    this.context.services.uiService
      .confirmModal(
        'Delete Rating?',
        'Are you sure you want to delete your rating for this product?',
        'warning',
        true,
        'Delete',
      )
      .then((isConfirmed) => {
        if (isConfirmed) {
          // Initialize Promise and message
          const promise = this.context.services.productService.removeRating(id);
          const msg = {
            loading: 'Removing rating...',
            success: 'Rating removed!',
            error: 'Failed to remove rating!',
          };

          this.fetching = true;
          this.setState({ ...this.state, rating: undefined });

          // Create a promise toast to notify user of request state
          this.context.services.uiService
            .promiseToast(promise, msg)
            .then((res) => {
              this.fetching = false;
              this.setState({ ...this.state });
            });
        }
      });
  }

  /** Fetches review of the user */
  fetchUserReview = () => {
    this.fetching = true;
    const user = this.context.state.user;
    const svc = this.context.services.productService;
    const productId = this.props.product.id;
    const criteria = new Criteria();
    criteria.addFilter('user', user.id);
    criteria.addFilter('product', productId);
    svc.getRatings(criteria).then((r) => {
      if (r.data.data?.length > 0) {
        // Set state if user review exists
        this.setState({
          ...this.state,
          rating: r.data.data[0],
        });
        this.fetching = false;
      } else {
        // Check if user has bought the product
        const criteria = new Criteria();
        criteria.addRelation('orderProducts');
        this.context.services.orderService
          .getUserProduct(user.id, productId)
          .then((res) => {
            this.setState({
              ...this.state,
              rating: false,
              orderState: res.data.orderState,
            });
            this.fetching = false;
          });
      }
    });
  };
}
