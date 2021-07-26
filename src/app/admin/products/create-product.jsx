import { Component } from 'react';
import Criteria from '../../models/criteria';
import Form from '../../components/form/form';
import { AppContext } from '../../context/app.provider';
import LoadingSpinner from '../../components/loading/loading-spinner';
import { generateFormData } from './admin-product.helper';

export default class CreateProduct extends Component {
  static contextType = AppContext;
  formData;
  criteria;

  constructor(props) {
    super(props);
    this.state = { controls: undefined, submitting: false };
    this.criteria = new Criteria();
    this.criteria.setLimit(10000);
  }

  componentDidMount() {
    this.context.services.categoryService
      .fetchCategories(this.criteria)
      .then((res) => {
        this.setState({ controls: generateFormData(res.data.data) });
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-8 mx-auto mt-5 p-0 card shadow">
          <h3 className="card-header text-center row">
            <div
              className="mx-2 text-clickable"
              onClick={() => this.props.history.goBack()}>
              &larr;
            </div>
            <div>Create a Product</div>
          </h3>
          {this.state.controls ? (
            <div className="card-body">
              <form
                className="d-flex flex-column"
                onSubmit={(e) => this.create(e)}>
                <Form
                  controls={this.state.controls}
                  onChange={(controls) => {
                    this.setState({ ...this.state, controls });
                  }}
                />
                <button
                  className="btn btn-primary ml-auto"
                  disabled={
                    !this.state.controls?.every((c) => c.isValid === true) ||
                    this.state.submitting
                  }>
                  Create
                </button>
              </form>
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    );
  }

  create(e) {
    e.preventDefault();
    const svc = this.context.services;
    const dataValid = this.state.controls.every((c) => c.isValid);

    if (!dataValid) svc.uiService.errorToast('Given data is invalid!');

    const product = {};
    this.state.controls.forEach((c) => {
      product[c.name] = c.value;
    });
    product.highlights = product.highlights.split('\n');
    product.images = product.images.split('\n');
    const promise = svc.productService.create(
      product,
      this.context.state.user.id,
    );
    const msgs = {
      loading: 'Creating product...',
      success: 'Product created successfully!',
      error: 'Could not create product!',
    };

    this.setState({ ...this.state, submitting: true });
    svc.uiService.promiseToast(promise, msgs).then(() => {
      this.setState({ ...this.state, submitting: false });
    });
  }
}
